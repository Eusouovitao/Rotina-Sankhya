import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/lib/theme-provider";
import { Settings as SettingsIcon, Moon, Sun, Monitor } from "lucide-react";

export default function Settings() {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { value: "light", label: "Claro", icon: Sun, description: "Tema claro para uso diurno" },
    { value: "dark", label: "Escuro", icon: Moon, description: "Tema escuro para uso noturno" },
    { value: "system", label: "Sistema", icon: Monitor, description: "Segue as configuracoes do sistema" },
  ] as const;

  return (
    <div className="flex-1 space-y-6 p-6 overflow-auto">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
          <SettingsIcon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Configuracoes</h1>
          <p className="text-sm text-muted-foreground">
            Personalize a aparencia e comportamento do sistema.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aparencia</CardTitle>
            <CardDescription>
              Personalize a aparencia visual do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base">Tema</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Selecione o tema de cores da interface.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {themeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={theme === option.value ? "default" : "outline"}
                    className="h-auto flex-col items-start gap-2 p-4 justify-start"
                    onClick={() => setTheme(option.value)}
                    data-testid={`button-theme-${option.value}`}
                  >
                    <div className="flex items-center gap-2">
                      <option.icon className="h-4 w-4" />
                      <span className="font-medium">{option.label}</span>
                    </div>
                    <span className="text-xs text-left font-normal opacity-80">
                      {option.description}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificacoes</CardTitle>
            <CardDescription>
              Configure como voce deseja receber notificacoes do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Notificacoes de status</Label>
                <p className="text-sm text-muted-foreground">
                  Receber alertas quando rotinas mudarem de status
                </p>
              </div>
              <Switch defaultChecked data-testid="switch-status-notifications" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Alertas de erro</Label>
                <p className="text-sm text-muted-foreground">
                  Ser notificado quando uma rotina falhar
                </p>
              </div>
              <Switch defaultChecked data-testid="switch-error-notifications" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Som de notificacao</Label>
                <p className="text-sm text-muted-foreground">
                  Reproduzir som ao receber notificacoes
                </p>
              </div>
              <Switch data-testid="switch-sound-notifications" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sobre o Sistema</CardTitle>
            <CardDescription>
              Informacoes sobre o Gerenciador de Rotinas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Versao</span>
                <span className="font-mono">1.0.0</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Desenvolvido por</span>
                <span>Sistema Admin</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ultima atualizacao</span>
                <span className="font-mono">05/12/2025</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
