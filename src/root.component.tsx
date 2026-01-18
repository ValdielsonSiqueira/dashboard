import "./index.css";
import Dashboard from "./components/dashboard";
import { ThemeProvider, SidebarProvider } from "@valoro/ui";

export default function Root(props) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <Dashboard />
      </SidebarProvider>
    </ThemeProvider>
  );
}
