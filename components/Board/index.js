import JobBoard from "../JobBoard";
import PaymentBoard from "../PaymentBoard";
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
      
      case "jobs":
        return <JobBoard />;
        break;

      case "payments":
        return <PaymentBoard />;
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