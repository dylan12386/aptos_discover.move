import { WalletSelector } from "./WalletSelector";
import { Image} from "antd";
export function Header() {
  return (
      <>

        <div className="flex items-center justify-between px-4 py-2 max-w-screen-xl mx-auto w-full flex-wrap">

          <h1 className="display">Chain Mark</h1>

            <Image preview={false} className="display" fallback={"https://github.com/dylan12386/aptos_discover/blob/main/ChainMARK.jpeg?raw=true"} style={{width:"20%",height:"20%",position:"relative",top:0,right:"80%",zIndex:-1}}></Image>
          <div className="flex gap-2 items-center flex-wrap">
            <WalletSelector />
          </div>
        </div>
      </>
  );
}
