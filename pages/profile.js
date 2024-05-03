import Board from "@/components/Board";
import NavBar from "@/components/NavBar";

export default function Profile() {
    return (
      <>
        <NavBar/>
        <Board page={"profile"} />
      </>
    );
  }