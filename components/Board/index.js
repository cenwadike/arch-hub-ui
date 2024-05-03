import InvoiceBoard from "../InvoiceBoard";
import ProfileBaord from "../ProfileBoard";
import ReviewBoard from "../ReviewBoard";
import StatusBoard from "../StatusBoard";

export default function Board({ page }) {
    switch (page) {
      case "profile":
        return (
            <ProfileBaord />
        );
        break;
      
      case "invoice":
        return <InvoiceBoard />;
        break;
  
      case "status":
        return <StatusBoard />;
        break;
  
      case "review":
        return <ReviewBoard />;
        break;
  
      default:
        break;
    }
  }