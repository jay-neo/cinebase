import { useParams } from "react-router-dom";
import { Authenticate } from "~/components/auth/Authenticate";

export default () => {
  const { provider } = useParams<{ provider: string }>();
  
  if (!provider) {
    return <div>Invalid provider</div>;
  }
  
  return <Authenticate provider={provider} />;
}