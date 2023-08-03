import { FC } from "react";
import { Alert, AlertDescription, AlertTitle } from "./Alert";
import { Copy, Server, SubscriptIcon } from "lucide-react";
import { Badge, BadgeProps } from "./badge";
import { Button } from "./Button";
import { useToast } from "./use-toast";
import { useOrigin } from "@/hooks/useOrigin";

interface ApiAlertProps {
  title: string;
  description: string;
  variant: "public" | "admin";
}

const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin",
};
const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
};

const ApiAlert: FC<ApiAlertProps> = ({ description, title, variant }) => {
  const { toast } = useToast();
  const onCopy = () => {
    navigator.clipboard.writeText(description);
    toast({
      title: "API route copied to the clipboard",
    });
  };
  return (
    <Alert>
      <Server className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-x-2">
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex items-center justify-between">
        <code className="relative rounded bg-muted px-2 py-1 font-mono text-sm font-semibold">
          {description}
        </code>
        <Button variant="outline" size="icon" onClick={onCopy}>
          <Copy className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ApiAlert;
