import Board from "@/components/Board";
import DomainName from "@/components/DomainName";
import NavBar from "@/components/NavBar";

export default function Profile() {
    return (
      <>
        <NavBar/>
        <DomainName />
        <Board page={"profile"} />
      </>
    );
  }