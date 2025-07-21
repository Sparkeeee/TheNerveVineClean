import SessionProviderWrapper from "@/components/SessionProviderWrapper";
export default function LoginLayout({ children }) {
    return (<SessionProviderWrapper>
      {children}
    </SessionProviderWrapper>);
}
