# Guia para Criar Páginas de Configurações Baseadas em Cards

Este guia mostra como criar páginas de configurações que exibem uma coleção de itens em cards, com ações em modais ou dropdowns.

**Outros padrões de configurações:**
- [Form-Based Settings](./SETTINGS_PAGE_GUIDE.md) - Para formulários de edição (perfil, conta)
- [Seções de Configurações](./SETTINGS_SECTIONS_GUIDE.md) - Para páginas com ações individuais e separadores
- [Dialog/Modal](./DIALOG_MODAL_GUIDE.md) - Para modais de configuração
- [SlideoutMenu](./SLIDEOUT_MENU_GUIDE.md) - Para painéis laterais

## Quando Usar Este Padrão

Use este padrão quando você precisa:
- Exibir uma lista de integrações, widgets ou recursos
- Permitir ações individuais em cada item (configurar, editar, excluir, etc.)
- Mostrar status ou toggles para ativar/desativar itens
- Abrir modais ou slideouts para configuração detalhada

**Não use este padrão para:**
- Formulários de edição simples → Use [SETTINGS_PAGE_GUIDE.md](./SETTINGS_PAGE_GUIDE.md)
- Ações individuais por seção → Use [SETTINGS_SECTIONS_GUIDE.md](./SETTINGS_SECTIONS_GUIDE.md)

## Estrutura Básica

```tsx
import { SectionFooter } from '@/components/untitled-ui/application/section-footers/section-footer';
import { SectionHeader } from '@/components/untitled-ui/application/section-headers/section-headers';
import { Button } from '@/components/untitled-ui/base/buttons/button';
import SettingsLayout from '@/layouts/settings-layout';
import { router } from '@inertiajs/react';
import { ReactNode } from 'react';

interface PageProps {
    items: Array<{
        id: string;
        name: string;
        // ... outras propriedades
    }>;
}

function Page({ items }: PageProps) {
    return (
        <div className="flex flex-col gap-6 px-4 lg:px-8">
            <SectionHeader.Root className="border-none pb-0">
                <SectionHeader.Group>
                    <div className="flex flex-1 flex-col justify-center gap-0.5">
                        <SectionHeader.Heading>Título da Página</SectionHeader.Heading>
                        <SectionHeader.Subheading>
                            Descrição da página
                        </SectionHeader.Subheading>
                    </div>
                </SectionHeader.Group>
            </SectionHeader.Root>

            <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-3">
                {items.map((item) => (
                    <li key={item.id}>
                        <div className="w-full flex-1 rounded-xl bg-primary_alt shadow-xs ring-1 ring-secondary ring-inset">
                            <div className="flex flex-col gap-6 px-4 py-5 lg:px-5">
                                <div className="flex gap-2">
                                    <div className="flex flex-1 items-center gap-3">
                                        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-white p-2 shadow-xs ring-1 ring-secondary ring-inset">
                                            {/* Ícone do item */}
                                        </div>
                                        <p className="text-md font-medium text-primary lg:text-md lg:font-semibold">
                                            {item.name}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-tertiary">Descrição do item</p>
                            </div>
                            <SectionFooter.Root isCard className="px-6 py-4">
                                <SectionFooter.Actions className="flex w-full justify-end">
                                    {/* Ações do card */}
                                </SectionFooter.Actions>
                            </SectionFooter.Root>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

Page.layout = (page: ReactNode) => <SettingsLayout children={page} defaultTab="sua-tab" />;

export default Page;
```

## Anatomia do Card

### 1. Container do Card
```tsx
<div className="w-full flex-1 rounded-xl bg-primary_alt shadow-xs ring-1 ring-secondary ring-inset">
```

### 2. Conteúdo do Card
```tsx
<div className="flex flex-col gap-6 px-4 py-5 lg:px-5">
    {/* Cabeçalho com ícone e título */}
    <div className="flex gap-2">
        <div className="flex flex-1 items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-white p-2 shadow-xs ring-1 ring-secondary ring-inset">
                <Icon className="h-12 w-12" />
            </div>
            <p className="text-md font-medium text-primary lg:text-md lg:font-semibold">
                Título
            </p>
        </div>
        {/* Opcional: Toggle ou badge no canto */}
    </div>

    {/* Descrição */}
    <p className="text-sm text-tertiary">Descrição do item</p>
</div>
```

### 3. Footer com Ações
```tsx
<SectionFooter.Root isCard className="px-6 py-4">
    <SectionFooter.Actions className="flex w-full justify-end">
        {/* Botões ou Dropdown */}
    </SectionFooter.Actions>
</SectionFooter.Root>
```

## Padrão 1: Com Toggle e Botões

Use quando você precisa ativar/desativar itens e configurá-los.

```tsx
import { Toggle } from '@/components/untitled-ui/base/toggle/toggle';

// No card
<div className="flex gap-2">
    <div className="flex flex-1 items-center gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-white p-2 shadow-xs ring-1 ring-secondary ring-inset">
            <Icon className="h-12 w-12" />
        </div>
        <p className="text-md font-medium text-primary lg:text-md lg:font-semibold">
            {item.name}
        </p>
    </div>
    {item.isConfigured && (
        <Toggle
            isSelected={item.isActive}
            size="sm"
            onChange={() => handleToggle(item.id)}
        />
    )}
</div>

// No footer
<SectionFooter.Actions className="flex w-full justify-between">
    <Button color="link-color" size="md" onClick={() => handleAction1()}>
        Ação 1
    </Button>
    <Button color="link-color" size="md" onClick={() => handleAction2()}>
        Ação 2
    </Button>
</SectionFooter.Actions>
```

**Exemplo:** `payment-processors.tsx`
- Toggle para ativar/desativar processador
- Botão "Tutorial" e botão "Configurar"/"Reconfigurar"

## Padrão 2: Com Dropdown de Ações

Use quando você tem múltiplas ações e quer economizar espaço.

```tsx
import { Dropdown } from '@/components/untitled-ui/base/dropdown/dropdown';
import { Copy01, Settings01, Trash01 } from '@untitledui/icons';

<SectionFooter.Actions className="flex w-full justify-end">
    <Dropdown.Root>
        <Dropdown.DotsButton />
        <Dropdown.Popover>
            <Dropdown.Menu>
                <Dropdown.Item
                    label="Copiar"
                    icon={Copy01}
                    onAction={() => handleCopy(item.id)}
                />
                <Dropdown.Item
                    label="Configurar"
                    icon={Settings01}
                    onAction={() => handleConfigure(item.id)}
                />
                <Dropdown.Item
                    label="Excluir"
                    icon={Trash01}
                    onAction={() => handleDelete(item.id)}
                    destructive
                />
            </Dropdown.Menu>
        </Dropdown.Popover>
    </Dropdown.Root>
</SectionFooter.Actions>
```

**Exemplo:** `widgets.tsx`
- Dropdown com ações: Copiar link, Personalizar, Testar alerta, Regenerar link

## Modais de Configuração

### Modal Simples (Dialog)

Use para formulários de configuração rápida.

```tsx
import { Dialog, Modal, ModalOverlay } from '@/components/untitled-ui/application/modals/modal';
import { CloseButton } from '@/components/untitled-ui/base/buttons/close-button';
import { Form } from '@/components/untitled-ui/base/form/form';
import { Input } from '@/components/untitled-ui/base/input/input';
import { BackgroundPattern } from '@/components/untitled-ui/shared-assets/background-patterns';
import { useForm } from '@inertiajs/react';
import { DialogTrigger as AriaDialogTrigger, Heading as AriaHeading } from 'react-aria-components';
import { useState } from 'react';

function Page({ items }: PageProps) {
    const [activeItem, setActiveItem] = useState<string | null>(null);

    const form = useForm({
        field1: '',
        field2: '',
    });

    const handleOpenModal = (itemName: string) => {
        setActiveItem(itemName);
    };

    const handleCloseModal = () => {
        setActiveItem(null);
        form.reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('sua.rota.store'), {
            preserveScroll: true,
            onSuccess: () => handleCloseModal(),
        });
    };

    return (
        <>
            {/* Cards aqui */}

            <AriaDialogTrigger
                isOpen={activeItem === 'Nome do Item'}
                onOpenChange={(open) => !open && handleCloseModal()}
            >
                <ModalOverlay isDismissable>
                    <Modal>
                        <Dialog>
                            <div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-120">
                                <CloseButton
                                    onClick={handleCloseModal}
                                    theme="light"
                                    size="lg"
                                    className="absolute top-3 right-3 z-10"
                                />

                                {/* Cabeçalho do Modal */}
                                <div className="flex flex-col gap-4 px-4 pt-5 pb-6 sm:px-6 sm:pt-6">
                                    <div className="relative flex size-14 items-center justify-center">
                                        <Icon className="z-10 h-12 w-12" />
                                        <BackgroundPattern
                                            pattern="circle"
                                            size="sm"
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                        />
                                    </div>
                                    <div className="z-10 flex flex-col gap-0.5">
                                        <AriaHeading slot="title" className="text-md font-semibold text-primary">
                                            Título do Modal
                                        </AriaHeading>
                                        <p className="text-sm text-tertiary">
                                            Descrição do modal
                                        </p>
                                    </div>
                                </div>

                                {/* Formulário */}
                                <Form onSubmit={handleSubmit}>
                                    <div className="flex flex-col gap-4 px-4 pb-6 sm:px-6">
                                        <Input
                                            type="text"
                                            size="md"
                                            isRequired
                                            placeholder="Digite algo..."
                                            label="Campo 1"
                                            hint={form.errors.field1 || 'Texto de ajuda'}
                                            value={form.data.field1}
                                            onChange={(value) => form.setData('field1', value)}
                                            isInvalid={!!form.errors.field1}
                                        />

                                        <Input
                                            type="text"
                                            size="md"
                                            isRequired
                                            placeholder="Digite algo..."
                                            label="Campo 2"
                                            hint={form.errors.field2 || 'Texto de ajuda'}
                                            value={form.data.field2}
                                            onChange={(value) => form.setData('field2', value)}
                                            isInvalid={!!form.errors.field2}
                                        />
                                    </div>

                                    {/* Botões de Ação */}
                                    <div className="flex flex-1 flex-col-reverse gap-3 p-4 *:grow sm:grid sm:grid-cols-2 sm:px-6 sm:pb-6">
                                        <Button
                                            type="button"
                                            color="secondary"
                                            size="lg"
                                            onClick={handleCloseModal}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            color="primary"
                                            size="lg"
                                            isDisabled={form.processing}
                                        >
                                            Salvar
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </Dialog>
                    </Modal>
                </ModalOverlay>
            </AriaDialogTrigger>
        </>
    );
}
```

### Modal com Upload de Arquivo

```tsx
import { FileUpload } from '@/components/untitled-ui/application/file-upload/file-upload-base';

const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

const form = useForm({
    field1: '',
    file: null as File | null,
});

const handleDropFiles = (files: FileList) => {
    const file = files[0];
    if (file) {
        form.setData('file', file);

        const newFile = {
            id: Math.random().toString(),
            name: file.name,
            size: file.size,
            type: file.type,
            progress: 0,
        };

        setUploadedFiles([newFile]);

        // Simular upload
        uploadFile(file, (progress) => {
            setUploadedFiles((prev) =>
                prev.map((uploadedFile) =>
                    uploadedFile.id === newFile.id
                        ? { ...uploadedFile, progress }
                        : uploadedFile
                ),
            );
        });
    }
};

const handleDeleteFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
    form.setData('file', null);
};

// No modal
<div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-secondary">Arquivo</label>
    <FileUpload.Root>
        <FileUpload.DropZone
            onDropFiles={handleDropFiles}
            accept=".pdf,.p12"
            hint="Arquivo .pdf ou .p12"
            allowsMultiple={false}
        />
        {uploadedFiles.length > 0 && (
            <FileUpload.List>
                {uploadedFiles.map((file) => (
                    <FileUpload.ListItemProgressBar
                        key={file.id}
                        {...file}
                        onDelete={() => handleDeleteFile(file.id)}
                        onRetry={() => handleRetryFile(file.id)}
                    />
                ))}
            </FileUpload.List>
        )}
    </FileUpload.Root>
    {form.errors.file && (
        <p className="text-sm text-error-primary">{form.errors.file}</p>
    )}
</div>
```

**Exemplo:** `payment-processors.tsx` - Modal Efi Bank com upload de certificado

## Gerenciamento de Estado

### Estado do Modal

```tsx
const [activeItem, setActiveItem] = useState<string | null>(null);

const handleOpenModal = (itemName: string) => {
    setActiveItem(itemName);
};

const handleCloseModal = () => {
    setActiveItem(null);
    form.reset();
};

// Verificar qual modal está aberto
<AriaDialogTrigger
    isOpen={activeItem === 'Item 1'}
    onOpenChange={(open) => !open && handleCloseModal()}
>
```

### Múltiplos Formulários

Quando você tem múltiplos modais, crie um `useForm` para cada um:

```tsx
const form1 = useForm({
    field1: '',
});

const form2 = useForm({
    field2: '',
    field3: '',
});

const handleCloseModal = () => {
    setActiveItem(null);
    form1.reset();
    form2.reset();
};
```

## Ações do Router

### Toggle de Status

```tsx
const handleToggle = (itemId: string) => {
    router.post(
        route('sua.rota.toggle', { item: itemId }),
        {},
        {
            preserveScroll: true,
        }
    );
};
```

### Ação Simples (Delete, Regenerate, etc.)

```tsx
const handleAction = (itemId: string) => {
    router.patch(
        route('sua.rota.action', itemId),
        {},
        {
            preserveScroll: true,
        }
    );
};
```

### Navegação

```tsx
const handleNavigate = (routeName: string) => {
    router.visit(route(routeName));
};
```

## Componentes Comuns

### SectionHeader
```tsx
<SectionHeader.Root className="border-none pb-0">
    <SectionHeader.Group>
        <div className="flex flex-1 flex-col justify-center gap-0.5">
            <SectionHeader.Heading>Título</SectionHeader.Heading>
            <SectionHeader.Subheading>Subtítulo</SectionHeader.Subheading>
        </div>
    </SectionHeader.Group>
</SectionHeader.Root>
```

### Grid Responsivo
```tsx
<ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-3">
    {/* Cards */}
</ul>
```

### Botões no Footer
```tsx
// Dois botões (esquerda e direita)
<SectionFooter.Actions className="flex w-full justify-between">
    <Button>Esquerda</Button>
    <Button>Direita</Button>
</SectionFooter.Actions>

// Botão único (direita)
<SectionFooter.Actions className="flex w-full justify-end">
    <Button>Ação</Button>
</SectionFooter.Actions>

// Múltiplos botões (direita)
<SectionFooter.Actions className="flex w-full justify-end gap-2">
    <Button>Ação 1</Button>
    <Button>Ação 2</Button>
</SectionFooter.Actions>
```

## Exemplo Completo

Veja os arquivos de referência:
- `payment-processors.tsx` - Exemplo com toggle, botões e modal com upload
- `widgets.tsx` - Exemplo com dropdown de ações

## Checklist para Nova Página Card-Based

- [ ] Criar interface de Props para os items
- [ ] Adicionar SectionHeader com título e descrição
- [ ] Criar grid responsivo de cards
- [ ] Adicionar ícone e título em cada card
- [ ] Adicionar descrição do item
- [ ] Implementar SectionFooter com ações
- [ ] Adicionar Toggle se necessário
- [ ] Criar estado para controle de modais
- [ ] Implementar modais de configuração
- [ ] Criar useForm para cada modal
- [ ] Implementar handlers de submit
- [ ] Implementar handlers de ações (toggle, delete, etc.)
- [ ] Adicionar validação de erros
- [ ] Aplicar SettingsLayout com defaultTab
- [ ] Testar todas as ações

## Dicas

1. **Estado do Modal**: Use um único estado `activeItem` para controlar qual modal está aberto
2. **Reset de Forms**: Sempre resete os forms ao fechar o modal
3. **preserveScroll**: Use `{ preserveScroll: true }` em todas as ações do router
4. **Ícones**: Use ícones de 48x48px (size-12) no container branco dos cards
5. **Grid Responsivo**: Use a classe padrão `grid-cols-1 md:grid-cols-2 xl:grid-cols-3`
6. **Dropdown**: Use quando tiver mais de 2 ações por item
7. **Botões**: Use quando tiver 1-2 ações principais por item
8. **isDismissable**: Adicione ao ModalOverlay para permitir fechar clicando fora
9. **BackgroundPattern**: Use o padrão "circle" atrás dos ícones nos modais
10. **Validação**: Sempre mostre erros de validação com `isInvalid` e `hint`

## Comparação dos Padrões

| Característica | Card-Based | Form-Based | Settings Sections |
|---------------|------------|------------|------------------|
| **Uso** | Lista de itens/recursos | Edição de dados | Ações individuais |
| **Layout** | Grid de cards | Formulário vertical | Duas colunas (desktop) |
| **Ações** | Por item (botões/dropdown) | Global (footer) | Individual por seção |
| **Submit** | Modal individual | Página inteira | Por seção |
| **Container** | `div` com grid | `SettingsFormContainer` | `SettingsSection` |
| **Separadores** | Não | Automático (FormSection) | Manual (`SettingsSectionDivider`) |
| **Exemplo** | `payment-processors.tsx` | `profile.tsx` | `controls.tsx` |

## Quando Usar Cada Padrão

### Use Card-Based quando:
- Exibir múltiplas integrações ou recursos
- Cada item tem suas próprias ações
- Precisa ativar/desativar items individualmente
- Ações abrem modais de configuração

### Use Form-Based quando:
- Editar dados de perfil/conta
- Formulário único com múltiplos campos
- Submit salva todos os campos de uma vez
- Campos são interdependentes
- Veja: [SETTINGS_PAGE_GUIDE.md](./SETTINGS_PAGE_GUIDE.md)

### Use Settings Sections quando:
- Múltiplas seções independentes
- Cada seção tem sua própria ação
- Toggles, botões, inputs simples
- Separadores visuais entre seções
- Veja: [SETTINGS_SECTIONS_GUIDE.md](./SETTINGS_SECTIONS_GUIDE.md)
