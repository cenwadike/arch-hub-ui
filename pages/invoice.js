import Board from "@/components/Board";
import NavBar from "@/components/NavBar";

export default function Invoice() {
    return (
      <>
        <NavBar/>
        <Board page={"invoice"} />
      </>
    );
}