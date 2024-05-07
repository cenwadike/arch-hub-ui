import { MdHomeFilled } from "react-icons/md";
import { LiaMoneyCheckAltSolid } from "react-icons/lia";
import { TbStatusChange } from "react-icons/tb";
import { VscOpenPreview } from "react-icons/vsc";
import SidebarIcon from '../SideBarIcon';
import Link from "next/link";


export default function NavBar() {
    return (
        <>
            <div className='fixed top-0 left-0 h-full w-2/12 m-0 flex flex-col bg-gray-900 text-secondary'>
                <Link href={"/profile"}>
                    <SidebarIcon icon={<MdHomeFilled size='28' />} text={"profile"} />
                </Link>
                <Link href={"/invoice"}>
                    <SidebarIcon icon={<LiaMoneyCheckAltSolid size='28' />} text={"invoices"} />
                </Link>
                <Link href={"/status"}>
                    <SidebarIcon icon={<TbStatusChange size='28' />} text={"status"} />
                </Link>
                <Link href={"/review"}>
                    <SidebarIcon icon={<VscOpenPreview size='28' />} text={"reviews"}/>
                </Link>
            </div>
        </>
    )
}