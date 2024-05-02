import { MdHomeFilled } from "react-icons/md";
import { LiaMoneyCheckAltSolid } from "react-icons/lia";
import { TbStatusChange } from "react-icons/tb";
import { VscOpenPreview } from "react-icons/vsc";
import SidebarIcon from '../SideBarIcon';


export default function NavBar() {
    return (
        <>
            <div className='fixed top-0 left-0 h-screen w-24 m-0 flex flex-col bg-gray-900 text-secondary shadow'>
                <SidebarIcon icon={<MdHomeFilled size='28' />} text={"profile"} />
                <SidebarIcon icon={<LiaMoneyCheckAltSolid size='28' />} text={"invoices"} />
                <SidebarIcon icon={<TbStatusChange size='28' />} text={"status"} />
                <SidebarIcon icon={<VscOpenPreview size='28' />} text={"reviews"}/>
            </div>
        </>
    )
}