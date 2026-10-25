# Guia de Seções de Configurações

Este guia mostra como usar os componentes de seções reutilizáveis para criar páginas de configurações com layout responsivo de duas colunas e separadores.

**Outros padrões de configurações:**
- [Form-Based Settings](./SETTINGS_PAGE_GUIDE.md) - Para formulários de edição (perfil, conta)
- [Card-Based Settings](./CARD_BASED_SETTINGS_GUIDE.md) - Para listas de integrações/recursos em cards
- [Dialog/Modal](./DIALOG_MODAL_GUIDE.md) - Para modais de configuração
- [SlideoutMenu](./SLIDEOUT_MENU_GUIDE.md) - Para painéis laterais

## Quando Usar Este Padrão

Use estes componentes quando você precisa:
- Criar páginas de configurações com múltiplas seções
- Layout de duas colunas (label à esquerda, conteúdo à direita) no desktop
- Separadores visuais entre seções
- Ações individuais por seção (toggles, botões, inputs)
- Responsividade (empilhado no mobile)

**Funciona com:**
- Páginas com formulário único ([SETTINGS_PAGE_GUIDE.md](./SETTINGS_PAGE_GUIDE.md))
- Páginas com ações individuais (como `controls.tsx`)
- Páginas com cards ([CARD_BASED_SETTINGS_GUIDE.md](./CARD_BASED_SETTINGS_GUIDE.md))

## Componentes Disponíveis

Todos os componentes estão disponíveis em `@/components/form-fields` (compartilhados com os form fields).

### 1. SettingsSection

Container principal que cria o layout de duas colunas responsivo com título e descrição integrados.

**Uso:**
```tsx
import { SettingsSection } from '@/components/form-fields';

<SettingsSection
    title="Título da seção"
    description="Descrição da seção"
>
    {/* Seu conteúdo aqui */}
</SettingsSection>
```

**Props:**
- `title: string` - Título da seção
- `description?: string` - Descrição/subtítulo (opcional)
- `isRequired?: boolean` - Marca a seção como obrigatória (opcional)
- `children: ReactNode` - Conteúdo da seção

**Layout:**
- **Desktop (lg+):** Grid de 2 colunas - Label (280px) | Conteúdo (512px)
- **Mobile:** Empilhado verticalmente

### 2. SettingsSectionLabel (Avançado)

Label/título standalone para casos avançados onde você precisa de controle total sobre o layout.

**Uso normal:** Use `SettingsSection` que já inclui o label automaticamente.

**Props:**
- `title: string` - Título da seção
- `description?: string` - Descrição/subtítulo (opcional)
- `isRequired?: boolean` - Marca como obrigatória (opcional)
- `children?: ReactNode` - Conteúdo adicional abaixo da descrição (opcional)

**Uso avançado:**
```tsx
import { SettingsSectionLabel, SettingsSectionContent } from '@/components/form-fields';

<div className="grid grid-cols-1 lg:grid-cols-[minmax(200px,280px)_minmax(400px,512px)] lg:gap-8">
    <SettingsSectionLabel
        title="Reprodução automática"
        description="Reproduza alertas automaticamente"
    />
    <SettingsSectionContent>
        <Toggle isSelected={value} onChange={handler} />
    </SettingsSectionContent>
</div>
```

**Comportamento:**
- **Desktop:** Usa `SectionLabel` component na coluna esquerda
- **Mobile:** Exibe como heading e parágrafo simples

### 3. SettingsSectionContent (Avançado)

Container para o conteúdo da seção quando você precisa de controle manual sobre o layout.

**Uso normal:** Coloque o conteúdo diretamente dentro de `SettingsSection`.

**Uso avançado:**
```tsx
import { SettingsSectionContent } from '@/components/form-fields';

<SettingsSectionContent>
    <Toggle isSelected={value} onChange={handler} />
</SettingsSectionContent>
```

**Nota:** Adiciona `gap-4` automaticamente entre elementos filhos.

### 4. SettingsSectionDivider

Separador horizontal entre seções.

**Uso:**
```tsx
import { SettingsSectionDivider } from '@/components/form-fields';

<SettingsSectionDivider />
```

## Estrutura Básica

```tsx
import { SettingsSection, SettingsSectionDivider } from '@/components/form-fields';

function Page() {
    return (
        <div className="flex flex-col gap-5">
            {/* Primeira Seção */}
            <SettingsSection
                title="Título da seção"
                description="Descrição da seção"
            >
                {/* Seus controles aqui */}
                <Toggle isSelected={value} onChange={handler} />
            </SettingsSection>

            <SettingsSectionDivider />

            {/* Segunda Seção */}
            <SettingsSection
                title="Outra seção"
                description="Outra descrição"
            >
                {/* Mais controles */}
                <Button onClick={handleAction}>Ação</Button>
            </SettingsSection>
        </div>
    );
}
```

## Padrões de Uso

### 1. Toggle/Switch

```tsx
import { SettingsSection } from '@/components/form-fields';
import { Switch } from 'react-aria-components';

<SettingsSection
    title="Reprodução automática"
    description="Reproduza alertas automaticamente quando uma doação for recebida"
>
    <Switch
        isSelected={isEnabled}
        onChange={handleToggle}
        className="group inline-flex touch-none items-center"
    >
        <div className="mr-4 h-6 w-11 cursor-pointer rounded-full border-2 border-transparent bg-border-secondary shadow-inner outline-focus-ring transition duration-200 ease-in-out group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-pressed:bg-border-secondary group-selected:bg-fg-brand-secondary group-selected:group-pressed:bg-fg-brand-secondary">
            <span className="block size-5 translate-x-0 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-selected:translate-x-5" />
        </div>
        <span className="text-sm font-medium text-primary">
            {isEnabled ? 'Ativado' : 'Desativado'}
        </span>
    </Switch>
</SettingsSection>
```

### 2. Botão de Ação

```tsx
import { SettingsSection } from '@/components/form-fields';
import { Button } from '@/components/untitled-ui/base/buttons/button';

<SettingsSection
    title="Gerenciar fila"
    description="Gerencie a fila de alertas e pule para o próximo"
>
    <Button
        size="md"
        iconLeading={SkipForward}
        onClick={handleClick}
        className="self-start"
    >
        Fila
    </Button>
</SettingsSection>
```

**Nota:** Use `className="self-start"` no botão para alinhá-lo à esquerda.

### 3. Input com Botão

```tsx
import { SettingsSection } from '@/components/form-fields';
import { Input } from '@/components/untitled-ui/base/input/input';
import { Button } from '@/components/untitled-ui/base/buttons/button';

<SettingsSection
    title="Seu perfil"
    description="Compartilhe seu link de doação"
>
    <div className="flex items-center gap-2">
        <Input value={profileUrl} isDisabled />
        <Button size="md" onClick={handleShare}>
            Compartilhar
        </Button>
    </div>
</SettingsSection>
```

### 4. Múltiplos Controles

```tsx
import { SettingsSection } from '@/components/form-fields';

<SettingsSection
    title="Configurações avançadas"
    description="Configure opções avançadas"
>
    <Input
        label="Campo 1"
        value={value1}
        onChange={setValue1}
    />
    <Input
        label="Campo 2"
        value={value2}
        onChange={setValue2}
    />
    <Button size="md" onClick={handleSave}>
        Salvar
    </Button>
</SettingsSection>
```

**Nota:** Os elementos terão `gap-4` entre eles automaticamente (aplicado pelo SettingsSection).

### 5. Select/Dropdown

```tsx
import { SettingsSection } from '@/components/form-fields';
import { Select } from '@/components/untitled-ui/base/select/select';

<SettingsSection
    title="Idioma"
    description="Escolha seu idioma preferido"
>
    <Select
        value={language}
        onChange={setLanguage}
        options={[
            { value: 'pt', label: 'Português' },
            { value: 'en', label: 'English' },
        ]}
    />
</SettingsSection>
```

### 6. Conteúdo Personalizado

```tsx
import { SettingsSection } from '@/components/form-fields';

<SettingsSection
    title="Estatísticas"
    description="Visualize suas estatísticas"
>
    <div className="rounded-lg border border-border-secondary bg-secondary p-4">
        <p className="text-sm font-semibold text-primary">Total de doações</p>
        <p className="text-2xl font-bold text-primary">R$ 1.234,56</p>
    </div>
</SettingsSection>
```

## Uso com Formulários

Os componentes funcionam perfeitamente com formulários do Inertia:

```tsx
import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { SettingsFormContainer, SettingsFormFooter } from '@/components/settings';

function Page({ initialData }: Props) {
    const form = useForm({
        field1: initialData.field1,
        field2: initialData.field2,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        form.put(route('settings.update'), {
            preserveScroll: true,
        });
    };

    return (
        <SettingsFormContainer onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
                <SettingsSection>
                    <SettingsSectionLabel
                        title="Campo 1"
                        description="Descrição do campo 1"
                    />
                    <SettingsSectionContent>
                        <Input
                            value={form.data.field1}
                            onChange={(value) => form.setData('field1', value)}
                            error={form.errors.field1}
                        />
                    </SettingsSectionContent>
                </SettingsSection>

                <SettingsSectionDivider />

                <SettingsSection>
                    <SettingsSectionLabel
                        title="Campo 2"
                        description="Descrição do campo 2"
                    />
                    <SettingsSectionContent>
                        <Input
                            value={form.data.field2}
                            onChange={(value) => form.setData('field2', value)}
                            error={form.errors.field2}
                        />
                    </SettingsSectionContent>
                </SettingsSection>
            </div>

            <SettingsFormFooter isDirty={form.isDirty} isProcessing={form.processing} />
        </SettingsFormContainer>
    );
}
```

## Uso com Ações Individuais

Para páginas onde cada seção tem sua própria ação (sem formulário único):

```tsx
import { router } from '@inertiajs/react';

function Page({ settings }: Props) {
    const handleToggleAutoplay = () => {
        router.post(
            route('settings.toggle-autoplay'),
            {},
            { preserveScroll: true }
        );
    };

    const handleToggleNotifications = () => {
        router.post(
            route('settings.toggle-notifications'),
            {},
            { preserveScroll: true }
        );
    };

    return (
        <div className="flex flex-col gap-5">
            <SettingsSection>
                <SettingsSectionLabel
                    title="Reprodução automática"
                    description="Ative ou desative a reprodução automática"
                />
                <SettingsSectionContent>
                    <Switch
                        isSelected={settings.autoplay}
                        onChange={handleToggleAutoplay}
                    >
                        {/* Switch UI */}
                    </Switch>
                </SettingsSectionContent>
            </SettingsSection>

            <SettingsSectionDivider />

            <SettingsSection>
                <SettingsSectionLabel
                    title="Notificações"
                    description="Receba notificações de novas doações"
                />
                <SettingsSectionContent>
                    <Switch
                        isSelected={settings.notifications}
                        onChange={handleToggleNotifications}
                    >
                        {/* Switch UI */}
                    </Switch>
                </SettingsSectionContent>
            </SettingsSection>
        </div>
    );
}
```

## Layout Responsivo

### Desktop (lg+)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ┌──────────────────┐  ┌──────────────────────────┐   │
│  │                  │  │                          │   │
│  │  Label           │  │  Content                 │   │
│  │  (280px)         │  │  (512px)                 │   │
│  │                  │  │                          │   │
│  └──────────────────┘  └──────────────────────────┘   │
│                                                         │
│  ────────────────────────────────────────────────────  │ (Divider)
│                                                         │
│  ┌──────────────────┐  ┌──────────────────────────┐   │
│  │                  │  │                          │   │
│  │  Label           │  │  Content                 │   │
│  │                  │  │                          │   │
│  └──────────────────┘  └──────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Mobile

```
┌──────────────────────┐
│                      │
│  Label (heading)     │
│  Description         │
│                      │
│  ┌────────────────┐  │
│  │                │  │
│  │  Content       │  │
│  │                │  │
│  └────────────────┘  │
│                      │
│  ──────────────────  │ (Divider)
│                      │
│  Label (heading)     │
│  Description         │
│                      │
│  ┌────────────────┐  │
│  │                │  │
│  │  Content       │  │
│  │                │  │
│  └────────────────┘  │
│                      │
└──────────────────────┘
```

## Exemplo Completo

Veja `resources/js/pages/streamers/controls.tsx` para um exemplo completo de uso.

```tsx
import { SettingsSection, SettingsSectionDivider } from '@/components/form-fields';
import { SectionHeader } from '@/components/untitled-ui/application/section-headers/section-headers';
import { Button } from '@/components/untitled-ui/base/buttons/button';
import { Input } from '@/components/untitled-ui/base/input/input';
import { router } from '@inertiajs/react';
import { Switch } from 'react-aria-components';
import { ReactNode } from 'react';

interface Props {
    autoplay_enabled: boolean;
    notifications_enabled: boolean;
    profile_url: string;
}

function Page({ autoplay_enabled, notifications_enabled, profile_url }: Props) {
    const handleToggleAutoplay = () => {
        router.post(route('settings.toggle-autoplay'), {}, { preserveScroll: true });
    };

    const handleToggleNotifications = () => {
        router.post(route('settings.toggle-notifications'), {}, { preserveScroll: true });
    };

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(profile_url);
    };

    return (
        <div className="flex flex-col gap-6 px-4 lg:px-8">
            <SectionHeader.Root>
                <SectionHeader.Group>
                    <div className="flex flex-1 flex-col justify-center gap-0.5">
                        <SectionHeader.Heading>Configurações</SectionHeader.Heading>
                        <SectionHeader.Subheading>
                            Gerencie suas preferências
                        </SectionHeader.Subheading>
                    </div>
                </SectionHeader.Group>
            </SectionHeader.Root>

            <div className="flex flex-col gap-5">
                {/* Autoplay Section */}
                <SettingsSection
                    title="Reprodução automática"
                    description="Reproduza alertas automaticamente quando uma doação for recebida"
                >
                    <Switch
                        isSelected={autoplay_enabled}
                        onChange={handleToggleAutoplay}
                        className="group inline-flex touch-none items-center"
                    >
                        <div className="mr-4 h-6 w-11 cursor-pointer rounded-full border-2 border-transparent bg-border-secondary shadow-inner outline-focus-ring transition duration-200 ease-in-out group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-pressed:bg-border-secondary group-selected:bg-fg-brand-secondary group-selected:group-pressed:bg-fg-brand-secondary">
                            <span className="block size-5 translate-x-0 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-selected:translate-x-5" />
                        </div>
                        <span className="text-sm font-medium text-primary">
                            {autoplay_enabled ? 'Ativado' : 'Desativado'}
                        </span>
                    </Switch>
                </SettingsSection>

                <SettingsSectionDivider />

                {/* Notifications Section */}
                <SettingsSection
                    title="Notificações"
                    description="Receba notificações de novas doações"
                >
                    <Switch
                        isSelected={notifications_enabled}
                        onChange={handleToggleNotifications}
                        className="group inline-flex touch-none items-center"
                    >
                        <div className="mr-4 h-6 w-11 cursor-pointer rounded-full border-2 border-transparent bg-border-secondary shadow-inner outline-focus-ring transition duration-200 ease-in-out group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-pressed:bg-border-secondary group-selected:bg-fg-brand-secondary group-selected:group-pressed:bg-fg-brand-secondary">
                            <span className="block size-5 translate-x-0 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-selected:translate-x-5" />
                        </div>
                        <span className="text-sm font-medium text-primary">
                            {notifications_enabled ? 'Ativado' : 'Desativado'}
                        </span>
                    </Switch>
                </SettingsSection>

                <SettingsSectionDivider />

                {/* Profile URL Section */}
                <SettingsSection
                    title="Seu perfil"
                    description="Compartilhe seu link de doação"
                >
                    <div className="flex items-center gap-2">
                        <Input value={profile_url} isDisabled />
                        <Button size="md" onClick={handleCopyUrl}>
                            Copiar
                        </Button>
                    </div>
                </SettingsSection>
            </div>
        </div>
    );
}

Page.layout = (page: ReactNode) => <SettingsLayout children={page} />;

export default Page;
```

## Checklist

- [ ] Importar componentes de settings-sections
- [ ] Criar container com `flex flex-col gap-5`
- [ ] Adicionar SettingsSection para cada configuração
- [ ] Cada seção tem SettingsSectionLabel e SettingsSectionContent
- [ ] Adicionar SettingsSectionDivider entre seções
- [ ] Usar `className="self-start"` em botões únicos
- [ ] Usar `flex items-center gap-2` para input + botão
- [ ] Testar responsividade (mobile e desktop)
- [ ] Verificar que labels aparecem corretamente no desktop e mobile

## Dicas

1. **Gap entre seções**: Use `flex flex-col gap-5` no container pai
2. **Botões únicos**: Adicione `className="self-start"` para alinhar à esquerda
3. **Input + Botão**: Use `flex items-center gap-2` como wrapper
4. **Última seção**: Não precisa de SettingsSectionDivider depois
5. **Switch**: Use as classes completas do exemplo para manter o estilo consistente
6. **Mobile**: O label é automaticamente exibido/ocultado, não precisa fazer nada
7. **preserveScroll**: Use `{ preserveScroll: true }` em chamadas do router
8. **Layout customizado**: Se precisar de larguras diferentes, use a grid diretamente
9. **Conteúdo complexo**: Você pode colocar qualquer JSX dentro de SettingsSectionContent
10. **SectionHeader**: Use no topo da página para título e descrição geral

## Diferenças dos Outros Padrões

| Característica | Sections | Form-Based | Card-Based |
|---------------|----------|------------|------------|
| **Layout** | 2 colunas com separadores | Formulário vertical | Grid de cards |
| **Ações** | Individual ou global | Global (footer) | Por card |
| **Separadores** | Sim (`<hr>`) | Não (dentro de FormSection) | Não |
| **Responsivo** | Label acima no mobile | Sempre vertical | Grid responsivo |
| **Uso** | Configurações gerais | Edição de perfil | Integrações/recursos |

## Quando Usar Cada Padrão

### Use Settings Sections quando:
- Página de configurações gerais
- Múltiplas seções independentes
- Ações individuais por seção
- Precisa de separadores visuais entre seções

### Use Form-Based quando:
- Editar dados de perfil/conta
- Formulário único com múltiplos campos
- Submit salva todos os campos de uma vez

### Use Card-Based quando:
- Exibir múltiplas integrações ou recursos
- Cada item tem suas próprias ações
- Ações abrem modais de configuração
