import {InputTransactionData, useWallet} from "@aptos-labs/wallet-adapter-react";
import { Segmented ,Input, Row, Col, message,Button, ConfigProvider,Image} from "antd";
// Internal Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { createStyles } from 'antd-style';
import { AntDesignOutlined } from '@ant-design/icons';
import {SetStateAction, useEffect, useState} from "react";
import {Aptos, AptosConfig, Network} from "@aptos-labs/ts-sdk";
import { SpeedInsights } from "@vercel/speed-insights/next"
// import Modal from "@mui/material/Modal";
// import {Box} from "@mui/material";
const { TextArea } = Input;

const aptosConfig = new AptosConfig({ network: Network.TESTNET});
const aptos = new Aptos(aptosConfig);
const useStyle = createStyles(({ prefixCls, css }) => ({
    linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      border-width: 0;

      > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: 0;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));


function App() {
    const {connected} = useWallet();
    const [choose, set_choose] = useState('User');
    const [organisztion_name,set_organisztion_name]=useState('');
    const [problem_describe,set_problem_describe]=useState('');
    const [organiszation_details,set_organiszation_details]=useState('')
    const [date,set_date]=useState('');
    const [lines, setLines] = useState<string[]>([]);
    const [reward,set_reward]=useState('')
    const { account, signAndSubmitTransaction } = useWallet();
    const [user_image_set,set_user_image_set]=useState<string[]>([]);
    const { styles } = useStyle();
    const [object_address,set_object_address]=useState('');
    const [now_show_image,set_now_show_image]=useState('');
    // const [wait_box_stats,set_wait_box_stats]=useState(true);
    const [owner_name ,set_owner_name ]=useState({address:'',name:'',
        organization_discribe:''})
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const inputText = e.target.value;
        // 将输入的文本通过换行符拆分成数组
        const inputArray = inputText.split('\n');
        setLines(inputArray);
        //console.log(lines)

    };
    const getRandomImage = () => {
        if (user_image_set.length === 0) return null ; // 检查数组是否为空
        const randomIndex = Math.floor(Math.random() * user_image_set.length);
        // console.log('get randomIndex', randomIndex)
        // console.log('get random ', user_image_set[1])
        return user_image_set[randomIndex];
    };
    // const close_box = () =>{
    //     set_wait_box_stats(false)
    // }

    const submit_transcction = async () => {
        if (!account) return [];
        if(organisztion_name == ''){message.error('Enter Organization name ');return []}
        if(organiszation_details == ''){message.error('Enter Organization  details ');return []}
        if(problem_describe == ''){message.error('Enter Problem describe');return []}
        if(date == ''){message.error('Enter Date ');return []};
        if(reward == ''){message.error('Enter reward ');return []};
        if(lines.length == 0){message.error('Enter Data set');return []};
        const transaction: InputTransactionData = {
            data: {
                function: "0x66cd3cc5d2d724d9eacc30a35cf61aef36c0fe69bc1c7ecb9444cae9a39aecd2::aptos_discover::create_problem_set" as `${string}::${string}::${string}`,
                typeArguments: [],
                functionArguments: [problem_describe, date, organiszation_details, organisztion_name, lines, (parseFloat(reward) * 100000000)]
            }
        }
        try {
            // sign and submit transaction to chain

            const response = await signAndSubmitTransaction(transaction);
            //set_wait_box_stats(true)
            // wait for transaction
            const transaction_1 = await aptos.waitForTransaction({transactionHash: response.hash});
            const link = `https://explorer.aptoslabs.com/txn/${transaction_1.hash}?network=testnet`;
            message.success(
                <span>
                            hash: <a href={link} target="_blank" rel="noopener noreferrer">{transaction_1.hash}</a>
                        </span>
            )

        } catch (error: any) {
        }
    }
    const answer_question = async(key:boolean) =>{
        if (!account) return [];
        const today = new Date();

        // 格式化成 YYYY-MM-DD 格式
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始计数，需要 +1
        const day = String(today.getDate()).padStart(2, '0');
        const dateString = `${year}${month}${day}`;
        const transaction: InputTransactionData = {
            data: {
                function: "0x66cd3cc5d2d724d9eacc30a35cf61aef36c0fe69bc1c7ecb9444cae9a39aecd2::aptos_discover::answer_question" as `${string}::${string}::${string}`,
                typeArguments: [],
                functionArguments: [now_show_image,key,dateString,object_address]
            }
        }
        try {
            // sign and submit transaction to chain
            const response = await signAndSubmitTransaction(transaction);
            // wait for transaction
            const transaction_1 = await aptos.waitForTransaction({transactionHash: response.hash});
            const link = `https://explorer.aptoslabs.com/txn/${transaction_1.hash}?network=testnet`;
            message.success(
                <span>
                            hash: <a href={link} target="_blank" rel="noopener noreferrer">{transaction_1.hash}</a>
                        </span>
            )
            let new_image = getRandomImage();
            while (new_image == now_show_image) {
                new_image = getRandomImage();  // 重新生成随机图片

            }
            console.log('new image vector',new_image)
            // 当找到一个与当前图片不同的新图片后，才更新状态
            if (new_image != null) {
                set_now_show_image(new_image);
            }

        } catch (error: any) {
            console.log(error)
        }

    }
    const get_data_from_nodit = async() =>{
        const options = {
            method: 'GET',
            headers: {accept: 'application/json', 'X-API-KEY': 'MjOHhhAn71CQcgmgY6nfaHt1YywmMKFw'}
        };


        try {
            let view_image = await  aptos.view({payload:{
                    function:"0x66cd3cc5d2d724d9eacc30a35cf61aef36c0fe69bc1c7ecb9444cae9a39aecd2::aptos_discover::image_vector",
                    typeArguments:[],
                    functionArguments:[]
                }})


            //console.log(view_image)
            //let new_vector= [] as string[];
            for(let i =0; i < view_image.length;i++){
               // new_vector.push(view_image[i] as  string)
                let a = view_image[i] as  string
                //console.log('a',a)
                // @ts-ignore
                set_user_image_set(a);
            }
            //set_user_image_set(new_vector)
        }catch (error:any){
            console.log(error)
        }


        try{
            let new_object_address = await aptos.view({payload:{
                    function:"0x66cd3cc5d2d724d9eacc30a35cf61aef36c0fe69bc1c7ecb9444cae9a39aecd2::aptos_discover::tell_object_address",
                    typeArguments:[],
                    functionArguments:[]
                }})

            console.log('new object address',new_object_address[0])

            fetch(`https://aptos-testnet.nodit.io/v1/accounts/${new_object_address[0]}/resource/0x66cd3cc5d2d724d9eacc30a35cf61aef36c0fe69bc1c7ecb9444cae9a39aecd2::aptos_discover::Problem_set`, options)
                .then(response => response.json())
                .then(response =>{
                    set_owner_name(response.data.owner)
                    // const imgUrlSet = response.data.question.inline_vec;
                    // const userImageSet =imgUrlSet.map(item => item.img_url_set);
                    // set_user_image_set(userImageSet)

                } )
                .catch(err => console.error(err));

            set_object_address(new_object_address[0] as  string)
            //console.log(new_object_address[0])
        }catch(error:any){
            console.log(error)
        }


    }
    useEffect(()=>{
        if(user_image_set){
            //console.log(user_image_set)
            const randomImage = getRandomImage();
            //console.log('new image vector',randomImage)
            if(randomImage != null){
                set_now_show_image(randomImage)
            }
        }
    },[user_image_set])
    useEffect(() => {
         get_data_from_nodit().then(r => console.log(r))
    }, []);
    // @ts-ignore
    return (
        <>
            <SpeedInsights/>
            <Header/>
            <div className="flex items-center justify-center flex-col">
                {connected ? (
                    <Card>
                        <CardHeader className="flex flex-col gap-10 pt-6">
                            <Segmented<string>
                                options={['User', 'Organization']}
                                onChange={(value: SetStateAction<string>) => {
                                set_choose(value); // string
                      }}
                            />
                        </CardHeader>
            <CardContent className="flex flex-col gap-10 pt-6">
                {/*<Wait_box/>*/}
                {choose === "User" ? <>
                        <Row gutter={[24,10]}>
                            <Col span={3}>
                                <h1>Organization Address:</h1>
                            </Col>
                            <Col span={21}>
                                <p>{owner_name.address}</p>
                            </Col>
                            <Col span={3}>
                                <h1>Organization Name:</h1>
                            </Col>
                            <Col span={21}>
                                <p>{owner_name.name}</p>
                            </Col>
                            <Col span={3}>
                                <h1>Organization details:</h1>
                            </Col>
                            <Col span={21}>
                                <p>{owner_name.organization_discribe}</p>
                            </Col>
                            <Col span={24} style={{height:"5%"}}><Image src={now_show_image} fallback={"https://github.com/dylan12386/aptos_discover/blob/main/ChainMARK.jpeg?raw=true"} style={{width:"50%",height:"50%"}}> </Image></Col>
                            <Col span={24}><p>Examination Is the picture A?</p></Col>
                            <Col span={4}><ConfigProvider
                                button={{
                                    className: styles.linearGradientButton,
                                }}
                            >

                                <Button type="primary" size="large" icon={<AntDesignOutlined />} onClick={()=>{answer_question(true).then(r =>console.log(r) )}} style={{width:"100%"}}>
                                    True
                                </Button>


                            </ConfigProvider></Col>
                            <Col span={4} offset={1}><ConfigProvider
                                button={{
                                    className: styles.linearGradientButton,
                                }}
                            >

                                <Button type="primary" size="large" icon={<AntDesignOutlined />} onClick={()=>{answer_question(false).then(r =>console.log(r) )}} style={{width:"100%"}}>
                                    False
                                </Button>


                            </ConfigProvider></Col>
                        </Row>
                    </>
                    :<>
                        <Row gutter={[24,10]}>
                            <Col span={24}><p>Organization name :</p></Col>
                            <Col span={24}>  <Input onChange={(value )=>{set_organisztion_name(value.target.value)}
                            }></Input></Col>
                            <Col span={24}>Tell us more about your organization</Col>
                            <Col span={24}><Input onChange={(value)=>{set_organiszation_details(value.target.value)}}></Input></Col>
                            <Col span={24}>Problem</Col>
                            <Col span={24}><Input onChange={(value)=>{set_problem_describe(value.target.value)}}></Input></Col>
                            <Col span={24}>Date</Col>
                            <Col span={24}><Input onChange={(value)=>{set_date(value.target.value)}}></Input></Col>
                            <Col span={24}>Reward</Col>
                            <Col span={24}><Input onChange={(value)=>{set_reward(value.target.value)}}></Input></Col>
                            <Col span={24}>Image Data set</Col>
                            <Col span={24}><TextArea rows={4}  onChange={handleInputChange} /></Col>
                            <Col span={24}>
                                <ConfigProvider
                                    button={{
                                        className: styles.linearGradientButton,
                                    }}
                                >

                                        <Button type="primary" size="large" icon={<AntDesignOutlined />} onClick={()=>{submit_transcction()}} style={{width:"inherit"}}>
                                            Upload Data Set
                                        </Button>


                                </ConfigProvider>



                            </Col>
                        </Row>


                    </>}


            </CardContent>
          </Card>
        ) : (
          <CardHeader>
            <CardTitle>To get started Connect a wallet</CardTitle>
          </CardHeader>
        )}


                {/*<Modal*/}
                {/*    disableEnforceFocus*/}
                {/*    disableAutoFocus*/}
                {/*    open={wait_box_stats}*/}
                {/*    onClose={close_box}*/}
                {/*    aria-labelledby="modal-modal-title"*/}
                {/*    aria-describedby="modal-modal-description"*/}
                {/*    classes={""}*/}
                {/*    sx={{borderRadius: 60,p:4,border:"white",'&:fouvu':{outline:'none'}}}*/}
                {/*>*/}
                {/*    <Box sx={{*/}
                {/*        position: 'absolute' as 'absolute',*/}

                {/*        top: '50%',*/}
                {/*        left: '50%',*/}
                {/*        transform: 'translate(-50%, -50%)',*/}
                {/*        width: 600,*/}
                {/*        borderRadius: 10,*/}
                {/*        backgroundColor:"#dfdace",*/}
                {/*        height:"auto",*/}
                {/*        boxShadow: 2,*/}
                {/*        p: 4,*/}
                {/*    }}>*/}

                {/*    </Box>*/}

                {/*</Modal>*/}
      </div>
    </>
  );
}

export default App;


