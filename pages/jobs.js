import Board from "@/components/Board";
import DomainName from "@/components/DomainName";
import NavBar from "@/components/NavBar";

export default function Jobs() {
    return (
      <>
        <NavBar/>
        <DomainName />
        <Board page={"jobs"} />
      </>
    );
}