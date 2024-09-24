module dapp::aptos_discover {

    use std::option;
    use std::signer;
    use std::signer::address_of;
    use std::string;
    use std::string::{utf8, String};
    use std::vector;
    use aptos_std::smart_vector;
    use aptos_framework::account;
    use aptos_framework::account::{SignerCapability, create_resource_address, create_signer_with_capability};
    use aptos_framework::object;
    use aptos_framework::object::{disable_ungated_transfer, DeleteRef, is_owner};
    use aptos_framework::primary_fungible_store::{create_primary_store_enabled_fungible_asset, deposit};
    use aptos_framework::resource_account::create_resource_account;
    use aptos_framework::fungible_asset;
    use aptos_std::debug;
    use aptos_framework::function_info;
    use aptos_framework::fungible_asset::Metadata;
    use aptos_framework::primary_fungible_store;
    use aptos_framework::timestamp;
    #[test_only]
    use aptos_framework::object::ObjectCore;

    const Seed:vector<u8> = b"discover";

    //Error  code
    const No_question_set:u64=1;
    const Not_exist_problem_set :u64 = 2;
    const No_this_image :u64 = 3;
    const Not_owner : u64 =4;

    struct Resource_store_object has key,drop {
        object:address
    }
    struct ChainMark_Object_cap has key , store {
        trans_cap : object::TransferRef,
        exten_cap : object::ExtendRef
    }
    struct ChainMark_FA_cap has key,store{
        mint_cap:fungible_asset::MintRef,
        burn_cap : fungible_asset::BurnRef,
        trans_cap  : fungible_asset::TransferRef
    }

    struct Object_cap has key ,drop, store {
        trans_cap : object::TransferRef,
        del_cap : object::DeleteRef,
       exten_cap : object::ExtendRef
    }


    struct ResourceCap has key{
        cap:SignerCapability
    }
    //owner of organiztion
    struct Organization has key,store{
        name:string::String,
        address:address,
        organization_discribe:string::String
    }
    //problem want to soleve
    struct Problem has key ,store{
        problem:string::String,
        owner_address:address,
        date:string::String
    }

    //data which want to aptos community to mark
    struct Q_set has key,store {
        img_url_set : string::String,
        true_number:u64,
        false_number:u64,
        answer_number:u64,
    }
    // user answer data
    struct User_answer has key,store{
        image:string::String,
        index_of_smart_vector:u64,
        answer:bool,
        user_address:address,
        date:string::String,
    }
    /// store all data
    struct Problem_set has key {
        owner:Organization,
        problem_details:Problem,
        question:smart_vector::SmartVector<Q_set>,
        true_answer:smart_vector::SmartVector<User_answer>,
        false_answer:smart_vector::SmartVector<User_answer>,
        reward:u64,
    }

    #[view]
    public fun tell_object_address():address acquires Resource_store_object {
        assert!(exists<Resource_store_object>(create_resource_address(&@dapp,Seed))==true,No_question_set);
        return borrow_global<Resource_store_object>(create_resource_address(&@dapp,Seed)).object
    }

    #[view]
    public fun image_vector () :vector<string::String> acquires Problem_set, Resource_store_object {
        let new_vector = vector::empty<String>();
        let length = smart_vector::length(&borrow_global<Problem_set>(borrow_global<Resource_store_object>(create_resource_address(&@dapp,Seed)).object).question);
        let i = 0;
        while(i < length ){
            let borrow= smart_vector::borrow(&borrow_global<Problem_set>(borrow_global<Resource_store_object>(create_resource_address(&@dapp,Seed)).object).question,i);
            vector::push_back(&mut new_vector,borrow.img_url_set) ;
            i= i +1;
        };
        return new_vector
    }
    #[view]
    public fun check_object_cap(caller:address):bool{
        exists<Object_cap>(caller)
    }

    // for Organization

    public entry fun del_object_owner (caller:&signer) acquires Object_cap {
        // let object_cap = &borrow_global<Object_cap>(signer::address_of(caller)).del_cap;
        // debug::print(&utf8(b"exist object cap"));
        // debug::print(&exists<Object_cap>(signer::address_of(caller)));
        let  Object_cap { trans_cap,del_cap,exten_cap } = move_from<Object_cap>(signer::address_of(caller));
        // debug::print(&utf8(b"exist object cap"));
        // debug::print(&object_cap);
        object::delete(del_cap);
    }
    public entry fun transfer_object_owner (caller:&signer,to:address) acquires  Object_cap{


        let  Object_cap { trans_cap,del_cap,exten_cap } = move_from<Object_cap>(signer::address_of(caller));
        let liner_transfer = object::generate_linear_transfer_ref(&trans_cap);
        object::transfer_with_ref(liner_transfer,to);
        move_to(caller,Object_cap{
            trans_cap,del_cap,exten_cap
        })
    }
    public entry fun create_problem_set (caller:&signer,problem1:string::String,date1:string::String,descibe:string::String,name_of_Organization:string::String,image_vector:vector<string::String>,reward_budget:u64) acquires ResourceCap, Resource_store_object {
        let new_organ = Organization{
            name:name_of_Organization,
            address:address_of(caller),
            organization_discribe:descibe
        };
        let new_smart_vector =smart_vector::empty<Q_set>();
        let length = vector::length(&image_vector);
        let i=0;
        while( i < length){
            let borrow_image = *vector::borrow(&image_vector,i);
            let new_q_set = Q_set{
                img_url_set:borrow_image,
                true_number:0,
                false_number:0,
                answer_number:0,
            };
            smart_vector::push_back(&mut new_smart_vector,new_q_set);
            i=i+1;
        };
        let new_Problem = Problem{
            problem:problem1,
            owner_address:address_of(caller),
            date:date1
        };

        let resource =&borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed)).cap;
        let resouces_signer = &create_signer_with_capability(resource);

        let new_object = &object::create_object(address_of(resouces_signer));
        let object_signer = &object::generate_signer(new_object);

        let new_del_red = object::generate_delete_ref(new_object);
        let new_trans_ref = object::generate_transfer_ref(new_object);
        let new_extent_ref = object::generate_extend_ref(new_object);

        let new_problem_set = Problem_set{
            owner:new_organ,
            problem_details:new_Problem,
            question:new_smart_vector,
            true_answer:smart_vector::empty<User_answer>(),
            false_answer:smart_vector::empty<User_answer>(),
            reward:reward_budget
        };
        move_to(caller,Object_cap{
            trans_cap:new_trans_ref,
            del_cap:new_del_red,
            exten_cap:new_extent_ref,
        });


        if(exists<Resource_store_object>(signer::address_of(resouces_signer))){
            move_from<Resource_store_object>(signer::address_of(resouces_signer));
            move_to(resouces_signer,Resource_store_object{object:address_of(object_signer)});
        }else{
            move_to(resouces_signer,Resource_store_object{object:address_of(object_signer)});
        };
        move_to(object_signer,new_problem_set);
    }

    // for user

    public entry fun answer_question(caller:&signer,image_url:string::String,answer1:bool,data1:string::String,problem_set_address:address) acquires Problem_set, ResourceCap, ChainMark_FA_cap {
        let resource = &borrow_global<ResourceCap>(create_resource_address(&@dapp,Seed)).cap;
        let resource_signer = &create_signer_with_capability(resource);
        assert!(exists<Problem_set>(problem_set_address),Not_exist_problem_set);
        let index = find_index(problem_set_address,image_url);
        let borrow = borrow_global_mut<Problem_set>(problem_set_address);
        assert!(index != 9999999,No_this_image);
        let conf = object::create_object(address_of(resource_signer));
        let new_user_anser = User_answer{
            image:image_url,
            index_of_smart_vector:index,
            answer:answer1,
            user_address:address_of(caller),
            date:data1
        };
        if (answer1){
            smart_vector::push_back(&mut borrow.true_answer,new_user_anser);
            smart_vector::borrow_mut(&mut borrow.question,index).true_number =smart_vector::borrow_mut(&mut borrow.question,index).true_number+1;
            smart_vector::borrow_mut(&mut borrow.question,index).answer_number =smart_vector::borrow_mut(&mut borrow.question,index).answer_number+1;
        }else{
            smart_vector::push_back(&mut borrow.false_answer,new_user_anser);
            smart_vector::borrow_mut(&mut borrow.question,index).false_number =smart_vector::borrow_mut(&mut borrow.question,index).false_number+1;
            smart_vector::borrow_mut(&mut borrow.question,index).answer_number =smart_vector::borrow_mut(&mut borrow.question,index).answer_number+1;
        };
        increase_CHP(caller,resource_signer);
    }

    //logic

    fun find_index (caller:address,image_target:string::String):u64 acquires Problem_set {
        let length = smart_vector::length(&borrow_global<Problem_set>(caller).question);
        let index = 9999999;
        let  i= 0;
        while (i < length ){
            let borrow_target = smart_vector::borrow(&borrow_global<Problem_set>(caller).question,i);
            if(image_target == borrow_target.img_url_set){
                index = i;
            };
            i = i+1;
        };
        return index
    }

    fun init_module(caller:&signer) {
        let (resource_signer, resource_cap) = account::create_resource_account(
                    caller,
                Seed
                );
        move_to(&resource_signer,ResourceCap{cap:resource_cap});
        let new_object_cons = object::create_named_object(&resource_signer,Seed);
        let new_trans_ref = object::generate_transfer_ref(&new_object_cons);
        let new_extent_ref = object::generate_extend_ref(&new_object_cons);

        disable_ungated_transfer( &new_trans_ref);
        let object_signer = &object::generate_signer(&new_object_cons);
         create_primary_store_enabled_fungible_asset(
             &new_object_cons,
         option::none(),
             utf8(b"ChainMark Coin"),
             utf8(b"CMC"),
             8,
             utf8(b"https://raw.githubusercontent.com/dylan12386/aptos_discover/refs/heads/main/ChainMARK.jpeg"),
             utf8(b"https://github.com/dylan12386/aptos_discover")
         );
        let mint_ref = fungible_asset::generate_mint_ref(&new_object_cons);
        let burn_ref = fungible_asset::generate_burn_ref(&new_object_cons);
        let tran_ref = fungible_asset::generate_transfer_ref(&new_object_cons);
        move_to( object_signer,ChainMark_FA_cap{
            mint_cap:mint_ref,
            burn_cap:burn_ref,
            trans_cap:tran_ref
        });
        move_to(&resource_signer,ChainMark_Object_cap{
            trans_cap:new_trans_ref,
            exten_cap:new_extent_ref,
        });
        // let deposit = function_info::new_function_info()
    }

    //pay

    fun increase_CHP (caller:&signer,resoures_signer:&signer) acquires ChainMark_FA_cap {

        let obj_address = object::create_object_address(&create_resource_address(&@dapp,Seed),Seed);
        let meta_data = object::address_to_object<Metadata>(obj_address);
        //debug::print(&object::is_owner(meta_data,signer::address_of(caller)));

        let borrow = borrow_global<ChainMark_FA_cap>(obj_address);
        // let obj_address = borrow_global<Resource_store_object>(create_resource_address(&@dapp,Seed)).object;
        // let new_coin=fungible_asset::mint(&borrow.mint_cap,100000000);
        assert!(is_owner(meta_data,create_resource_address(&@dapp,Seed)),Not_owner);
        primary_fungible_store::mint(&borrow.mint_cap,create_resource_address(&@dapp,Seed),100000000);
        primary_fungible_store::transfer(resoures_signer,meta_data,signer::address_of(caller),100000000)
        //  debug::print(&utf8(b"caller CHC Balance"));
        //  debug::print(& primary_fungible_store::balance(signer::address_of(caller),meta_data));
        //
        // debug::print(&utf8(b"user CHC Balance"));
        // debug::print(& primary_fungible_store::balance(user1,meta_data));

        // let new_object = object::address_to_object<>(obj_address);
        //fungible_asset::deposit(caller);
        //primary_fungible_store::deposit(signer::address_of(caller),new_coin);



    }


    // test
    #[test(caller=@dapp,organisztion_signer=@0x4,user1=@0x789)]
    fun test_init (caller:&signer,organisztion_signer:&signer,user1:&signer) acquires ResourceCap, Problem_set, Resource_store_object, ChainMark_FA_cap, Object_cap {
        init_module(caller);
        let image_vector =vector::empty<string::String>();
        vector::push_back(&mut image_vector,utf8(b"aaa"));
        vector::push_back(&mut image_vector,utf8(b"bbb"));
        create_problem_set(organisztion_signer,utf8(b"solve image of A"),utf8(b"2024/09/22 - 2024/12/15"),utf8(b"help us mark  down the image isn't A , we will use it to tran AI "),utf8(b"Test Company"),image_vector,100000000);
        let address1 = borrow_global<Resource_store_object>(create_resource_address(&@dapp,Seed)).object;
        answer_question(user1,utf8(b"aaa"),true,utf8(b"2024/09/22"),address1);
        // let object_extend = &borrow_global<ChainMark_Object_cap>(create_resource_address(&@dapp,Seed)).exten_cap;
        // let object_signer = &object::generate_signer_for_extending(object_extend);
        // debug::print(&object::address_to_object<ObjectCore>(address_of(object_signer)));
        // debug::print(borrow_global<Problem_set>(address1));
        // debug::print(&image_vector() );

        //increase_CHP(caller);
        //withdraw_CHC(signer::address_of(caller),user1);



        //del_object_owner(organisztion_signer);

        let obj_address = object::create_object_address(&create_resource_address(&@dapp,Seed),Seed);
        let obj_metadata = object::address_to_object<Metadata>(obj_address);

        // debug::print(&utf8(b"caller CHC Balance"));
        // debug::print(& primary_fungible_store::balance(signer::address_of(caller),obj_metadata));
        //
        // debug::print(&utf8(b"user CHC Balance"));
        // debug::print(& primary_fungible_store::balance(signer::address_of(user1),obj_metadata));
    }

    #[test_only]
    fun withdraw_CHC (caller:address,user:&signer){
        let obj_address = object::create_object_address(&create_resource_address(&@dapp,Seed),Seed);
        let obj_metadata = object::address_to_object<Metadata>(obj_address);
        let withdraw1= primary_fungible_store::withdraw(user,obj_metadata,10000000);
        primary_fungible_store::deposit(caller,withdraw1);

        debug::print(&utf8(b"caller CHC Balance"));
        debug::print(& primary_fungible_store::balance(caller,obj_metadata));

        debug::print(&utf8(b"user CHC Balance"));
        debug::print(& primary_fungible_store::balance(signer::address_of(user),obj_metadata));
    }
}
