# Guia de Modais (Dialog)

Este guia mostra como criar modais elegantes e consistentes usando os componentes do sistema de design.

**Outros padrões de configurações:**
- [Form-Based Settings](./SETTINGS_PAGE_GUIDE.md) - Para formulários de edição (perfil, conta)
- [Card-Based Settings](./CARD_BASED_SETTINGS_GUIDE.md) - Para listas de integrações/recursos em cards
- [Seções de Configurações](./SETTINGS_SECTIONS_GUIDE.md) - Para páginas com ações individuais e separadores
- [SlideoutMenu](./SLIDEOUT_MENU_GUIDE.md) - Para painéis laterais

## Anatomia de um Modal

Um modal completo é composto por várias camadas:

```tsx
import { Dialog, Modal, ModalOverlay } from '@/components/untitled-ui/application/modals/modal';
import { CloseButton } from '@/components/untitled-ui/base/buttons/close-button';
import { Button } from '@/components/untitled-ui/base/buttons/button';
import { Form } from '@/components/untitled-ui/base/form/form';
import { BackgroundPattern } from '@/components/untitled-ui/shared-assets/background-patterns';
import { DialogTrigger as AriaDialogTrigger, Heading as AriaHeading } from 'react-aria-components';
import { useState } from 'react';

<AriaDialogTrigger isOpen={isOpen} onOpenChange={(open) => !open && handleClose()}>
    <ModalOverlay isDismissable>
        <Modal>
            <Dialog>
                {/* Conteúdo do modal */}
            </Dialog>
        </Modal>
    </ModalOverlay>
</AriaDialogTrigger>
```

## Estrutura Completa

### Modal Básico

```tsx
function Page() {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm({
        field1: '',
        field2: '',
    });

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        form.reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('sua.rota'), {
            preserveScroll: true,
            onSuccess: () => handleClose(),
        });
    };

    return (
        <>
            <Button onClick={handleOpen}>Abrir Modal</Button>

            <AriaDialogTrigger
                isOpen={isOpen}
                onOpenChange={(open) => !open && handleClose()}
            >
                <ModalOverlay isDismissable>
                    <Modal>
                        <Dialog>
                            <div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-120">
                                {/* Botão de Fechar */}
                                <CloseButton
                                    onClick={handleClose}
                                    theme="light"
                                    size="lg"
                                    className="absolute top-3 right-3 z-10"
                                />

                                {/* Cabeçalho */}
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
                                            Descrição ou subtítulo do modal
                                        </p>
                                    </div>
                                </div>

                                {/* Conteúdo/Formulário */}
                                <Form onSubmit={handleSubmit}>
                                    <div className="flex flex-col gap-4 px-4 pb-6 sm:px-6">
                                        {/* Campos do formulário */}
                                    </div>

                                    {/* Ações */}
                                    <div className="flex flex-1 flex-col-reverse gap-3 p-4 *:grow sm:grid sm:grid-cols-2 sm:px-6 sm:pb-6">
                                        <Button
                                            type="button"
                                            color="secondary"
                                            size="lg"
                                            onClick={handleClose}
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

## Componentes do Modal

### 1. AriaDialogTrigger

Controla a abertura e fechamento do modal.

**Props:**
- `isOpen: boolean` - Estado de abertura do modal
- `onOpenChange: (isOpen: boolean) => void` - Callback quando o estado muda

```tsx
<AriaDialogTrigger
    isOpen={isOpen}
    onOpenChange={(open) => !open && handleClose()}
>
```

**Padrão:** Use `!open && handleClose()` para chamar sua função de fechar quando o modal for fechado.

### 2. ModalOverlay

Camada de fundo escuro atrás do modal.

**Props:**
- `isDismissable?: boolean` - Permite fechar clicando fora do modal (padrão: true)

```tsx
<ModalOverlay isDismissable>
```

**Dica:** Use `isDismissable` para modais que podem ser fechados sem perder dados.

### 3. Modal

Container do modal com animações e posicionamento.

```tsx
<Modal>
```

**Nota:** Não precisa de props adicionais na maioria dos casos.

### 4. Dialog

Wrapper semântico para o conteúdo do modal.

```tsx
<Dialog>
    {/* Conteúdo */}
</Dialog>
```

### 5. Container Principal

```tsx
<div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-120">
```

**Classes importantes:**
- `relative` - Para posicionar o CloseButton absoluto
- `overflow-hidden` - Para conter o conteúdo
- `rounded-2xl` - Bordas arredondadas
- `sm:max-w-120` - Largura máxima no desktop (480px)

**Variações de largura:**
- `sm:max-w-80` - 320px (modais pequenos)
- `sm:max-w-120` - 480px (padrão)
- `sm:max-w-160` - 640px (modais grandes)
- `sm:max-w-200` - 800px (modais extra grandes)

## Cabeçalho do Modal

### Estrutura Padrão

```tsx
<div className="flex flex-col gap-4 px-4 pt-5 pb-6 sm:px-6 sm:pt-6">
    {/* Ícone com Background Pattern */}
    <div className="relative flex size-14 items-center justify-center">
        <Icon className="z-10 h-12 w-12" />
        <BackgroundPattern
            pattern="circle"
            size="sm"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
    </div>

    {/* Título e Descrição */}
    <div className="z-10 flex flex-col gap-0.5">
        <AriaHeading slot="title" className="text-md font-semibold text-primary">
            Título do Modal
        </AriaHeading>
        <p className="text-sm text-tertiary">
            Descrição ou subtítulo do modal
        </p>
    </div>
</div>
```

### Ícone com Background Pattern

O padrão decorativo atrás do ícone cria um efeito visual elegante:

```tsx
<div className="relative flex size-14 items-center justify-center">
    <YourIcon className="z-10 h-12 w-12" />
    <BackgroundPattern
        pattern="circle"
        size="sm"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    />
</div>
```

**Padrões disponíveis:**
- `circle` - Círculos concêntricos (mais comum)
- `grid` - Grade de pontos
- `diagonal` - Linhas diagonais

**Tamanhos:**
- `sm` - Pequeno (padrão para modais)
- `md` - Médio
- `lg` - Grande

### Título e Descrição

```tsx
<div className="z-10 flex flex-col gap-0.5">
    <AriaHeading slot="title" className="text-md font-semibold text-primary">
        Configure o Processador
    </AriaHeading>
    <p className="text-sm text-tertiary">
        Adicione suas credenciais de API para começar a aceitar pagamentos.
    </p>
</div>
```

**Nota:** O `z-10` garante que o texto fique acima do background pattern.

## Conteúdo do Modal

### Formulário Simples

```tsx
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
            placeholder="Digite outro valor..."
            label="Campo 2"
            hint={form.errors.field2}
            value={form.data.field2}
            onChange={(value) => form.setData('field2', value)}
            isInvalid={!!form.errors.field2}
        />
    </div>

    {/* Ações do formulário */}
</Form>
```

### Com Upload de Arquivo

```tsx
import { FileUpload } from '@/components/untitled-ui/application/file-upload/file-upload-base';

const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

const handleDropFiles = (files: FileList) => {
    const file = files[0];
    if (file) {
        form.setData('certificate', file);

        const newFile = {
            id: Math.random().toString(),
            name: file.name,
            size: file.size,
            type: file.type,
            progress: 0,
        };

        setUploadedFiles([newFile]);

        // Simular progresso de upload
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
    form.setData('certificate', null);
};

// No formulário
<div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-secondary">Certificado</label>
    <FileUpload.Root>
        <FileUpload.DropZone
            onDropFiles={handleDropFiles}
            accept=".p12"
            hint="Arquivo .p12"
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
    {form.errors.certificate && (
        <p className="text-sm text-error-primary">{form.errors.certificate}</p>
    )}
</div>
```

### Conteúdo Apenas Texto (Sem Formulário)

```tsx
<div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-120">
    <CloseButton {...} />

    <div className="flex flex-col gap-4 px-4 pt-5 pb-6 sm:px-6 sm:pt-6">
        {/* Cabeçalho */}
    </div>

    {/* Conteúdo */}
    <div className="flex flex-col gap-4 px-4 pb-6 sm:px-6">
        <p className="text-sm text-secondary">
            Seu conteúdo aqui...
        </p>
    </div>

    {/* Ações */}
    <div className="flex flex-1 flex-col-reverse gap-3 p-4 *:grow sm:grid sm:grid-cols-2 sm:px-6 sm:pb-6">
        <Button type="button" color="secondary" size="lg" onClick={handleClose}>
            Fechar
        </Button>
        <Button type="button" color="primary" size="lg" onClick={handleAction}>
            Confirmar
        </Button>
    </div>
</div>
```

## Ações do Modal

### Padrão de Dois Botões (Cancelar + Ação)

```tsx
<div className="flex flex-1 flex-col-reverse gap-3 p-4 *:grow sm:grid sm:grid-cols-2 sm:px-6 sm:pb-6">
    <Button
        type="button"
        color="secondary"
        size="lg"
        onClick={handleClose}
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
```

**Classes importantes:**
- `flex-col-reverse` - No mobile, o botão primário fica em cima
- `*:grow` - Botões ocupam largura total no mobile
- `sm:grid sm:grid-cols-2` - No desktop, botões lado a lado
- `gap-3` - Espaçamento entre botões

### Botão Único

```tsx
<div className="flex justify-end gap-3 p-4 sm:px-6 sm:pb-6">
    <Button
        type="button"
        color="primary"
        size="lg"
        onClick={handleClose}
    >
        Entendi
    </Button>
</div>
```

### Três ou Mais Botões

```tsx
<div className="flex flex-col gap-3 p-4 sm:flex-row sm:justify-end sm:px-6 sm:pb-6">
    <Button type="button" color="secondary" size="lg" onClick={handleClose}>
        Cancelar
    </Button>
    <Button type="button" color="secondary" size="lg" onClick={handleSaveAsDraft}>
        Salvar Rascunho
    </Button>
    <Button type="submit" color="primary" size="lg" isDisabled={form.processing}>
        Publicar
    </Button>
</div>
```

### Botão Destrutivo

```tsx
<div className="flex flex-1 flex-col-reverse gap-3 p-4 *:grow sm:grid sm:grid-cols-2 sm:px-6 sm:pb-6">
    <Button type="button" color="secondary" size="lg" onClick={handleClose}>
        Cancelar
    </Button>
    <Button type="button" color="error" size="lg" onClick={handleDelete}>
        Excluir
    </Button>
</div>
```

## CloseButton

```tsx
<CloseButton
    onClick={handleClose}
    theme="light"
    size="lg"
    className="absolute top-3 right-3 z-10"
/>
```

**Props:**
- `onClick: () => void` - Função de fechar
- `theme: "light" | "dark"` - Tema do botão (use "light" para fundo claro)
- `size: "sm" | "md" | "lg"` - Tamanho do botão (use "lg" para modais)
- `className` - Classes adicionais (sempre use `absolute top-3 right-3 z-10`)

## Gerenciamento de Estado

### Estado Básico

```tsx
const [isOpen, setIsOpen] = useState(false);

const handleOpen = () => setIsOpen(true);
const handleClose = () => {
    setIsOpen(false);
    form.reset(); // Sempre resete o form ao fechar
};
```

### Múltiplos Modais

Use um único estado com string:

```tsx
const [activeModal, setActiveModal] = useState<string | null>(null);

const handleOpenModal1 = () => setActiveModal('modal1');
const handleOpenModal2 = () => setActiveModal('modal2');

const handleClose = () => {
    setActiveModal(null);
    form1.reset();
    form2.reset();
};

// Nos modais
<AriaDialogTrigger
    isOpen={activeModal === 'modal1'}
    onOpenChange={(open) => !open && handleClose()}
>

<AriaDialogTrigger
    isOpen={activeModal === 'modal2'}
    onOpenChange={(open) => !open && handleClose()}
>
```

### Com Dados Dinâmicos

```tsx
const [selectedItem, setSelectedItem] = useState<Item | null>(null);

const handleOpenWithItem = (item: Item) => {
    setSelectedItem(item);
    form.setData({
        field1: item.field1,
        field2: item.field2,
    });
};

const handleClose = () => {
    setSelectedItem(null);
    form.reset();
};

<AriaDialogTrigger
    isOpen={selectedItem !== null}
    onOpenChange={(open) => !open && handleClose()}
>
```

## Validação e Erros

### Exibir Erros do Backend

```tsx
<Input
    type="text"
    size="md"
    isRequired
    label="Campo"
    value={form.data.field}
    onChange={(value) => form.setData('field', value)}
    hint={form.errors.field || 'Texto de ajuda quando não há erro'}
    isInvalid={!!form.errors.field}
/>
```

### Validação Client-Side

```tsx
const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!form.data.email.includes('@')) {
        errors.email = 'Email inválido';
    }

    if (form.data.password.length < 8) {
        errors.password = 'Senha deve ter pelo menos 8 caracteres';
    }

    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
};

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    form.post(route('sua.rota'), {
        preserveScroll: true,
        onSuccess: () => handleClose(),
    });
};
```

## Tipos TypeScript

### UploadedFile

```tsx
type UploadedFile = {
    id: string;
    name: string;
    size: number;
    type: string;
    progress: number;
    failed?: boolean;
};
```

### Form Data

```tsx
interface FormData {
    field1: string;
    field2: string;
    file: File | null;
}

const form = useForm<FormData>({
    field1: '',
    field2: '',
    file: null,
});
```

## Exemplos de Uso

### Modal de Confirmação

```tsx
<AriaDialogTrigger isOpen={isOpen} onOpenChange={(open) => !open && handleClose()}>
    <ModalOverlay isDismissable>
        <Modal>
            <Dialog>
                <div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-120">
                    <CloseButton onClick={handleClose} theme="light" size="lg" className="absolute top-3 right-3 z-10" />

                    <div className="flex flex-col gap-4 px-4 pt-5 pb-6 sm:px-6 sm:pt-6">
                        <div className="relative flex size-14 items-center justify-center">
                            <AlertTriangle className="z-10 h-12 w-12 text-error-primary" />
                            <BackgroundPattern
                                pattern="circle"
                                size="sm"
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            />
                        </div>
                        <div className="z-10 flex flex-col gap-0.5">
                            <AriaHeading slot="title" className="text-md font-semibold text-primary">
                                Confirmar exclusão
                            </AriaHeading>
                            <p className="text-sm text-tertiary">
                                Esta ação não pode ser desfeita. Tem certeza que deseja continuar?
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-1 flex-col-reverse gap-3 p-4 *:grow sm:grid sm:grid-cols-2 sm:px-6 sm:pb-6">
                        <Button type="button" color="secondary" size="lg" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button type="button" color="error" size="lg" onClick={handleConfirm}>
                            Excluir
                        </Button>
                    </div>
                </div>
            </Dialog>
        </Modal>
    </ModalOverlay>
</AriaDialogTrigger>
```

### Modal de Sucesso

```tsx
<div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-120">
    <CloseButton onClick={handleClose} theme="light" size="lg" className="absolute top-3 right-3 z-10" />

    <div className="flex flex-col gap-4 px-4 pt-5 pb-6 sm:px-6 sm:pt-6">
        <div className="relative flex size-14 items-center justify-center">
            <CheckCircle className="z-10 h-12 w-12 text-success-primary" />
            <BackgroundPattern
                pattern="circle"
                size="sm"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
        </div>
        <div className="z-10 flex flex-col gap-0.5">
            <AriaHeading slot="title" className="text-md font-semibold text-primary">
                Configuração salva!
            </AriaHeading>
            <p className="text-sm text-tertiary">
                Suas alterações foram salvas com sucesso.
            </p>
        </div>
    </div>

    <div className="flex justify-end gap-3 p-4 sm:px-6 sm:pb-6">
        <Button type="button" color="primary" size="lg" onClick={handleClose}>
            Fechar
        </Button>
    </div>
</div>
```

### Modal de Informação

```tsx
<div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-120">
    <CloseButton onClick={handleClose} theme="light" size="lg" className="absolute top-3 right-3 z-10" />

    <div className="flex flex-col gap-4 px-4 pt-5 pb-6 sm:px-6 sm:pt-6">
        <div className="relative flex size-14 items-center justify-center">
            <InfoCircle className="z-10 h-12 w-12 text-primary" />
            <BackgroundPattern
                pattern="circle"
                size="sm"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
        </div>
        <div className="z-10 flex flex-col gap-0.5">
            <AriaHeading slot="title" className="text-md font-semibold text-primary">
                Como funciona
            </AriaHeading>
            <p className="text-sm text-tertiary">
                Informações importantes sobre este recurso.
            </p>
        </div>
    </div>

    <div className="flex flex-col gap-4 px-4 pb-6 sm:px-6">
        <ul className="list-disc space-y-2 pl-5 text-sm text-secondary">
            <li>Primeiro ponto importante</li>
            <li>Segundo ponto importante</li>
            <li>Terceiro ponto importante</li>
        </ul>
    </div>

    <div className="flex justify-end gap-3 p-4 sm:px-6 sm:pb-6">
        <Button type="button" color="primary" size="lg" onClick={handleClose}>
            Entendi
        </Button>
    </div>
</div>
```

## Checklist

- [ ] Importar componentes necessários (Dialog, Modal, ModalOverlay, etc.)
- [ ] Criar estado de controle (isOpen ou activeModal)
- [ ] Criar useForm se necessário
- [ ] Implementar handleOpen e handleClose
- [ ] Adicionar AriaDialogTrigger com isOpen e onOpenChange
- [ ] Adicionar ModalOverlay com isDismissable
- [ ] Adicionar CloseButton no canto superior direito
- [ ] Criar cabeçalho com ícone e BackgroundPattern
- [ ] Adicionar título com AriaHeading
- [ ] Adicionar descrição
- [ ] Implementar formulário ou conteúdo
- [ ] Adicionar botões de ação no footer
- [ ] Implementar handleSubmit
- [ ] Resetar form ao fechar
- [ ] Testar validação de erros
- [ ] Testar responsividade (mobile e desktop)

## Dicas

1. **Sempre resete o form** ao fechar o modal para evitar dados antigos
2. **Use isDismissable** para permitir fechar clicando fora (melhor UX)
3. **BackgroundPattern** adiciona elegância visual, sempre use com o ícone
4. **z-10 no ícone e título** garante que fiquem acima do pattern
5. **preserveScroll** nas requisições mantém a posição da página
6. **flex-col-reverse** no footer garante que o botão primário fique em cima no mobile
7. **max-w-120** é o tamanho padrão, ajuste conforme necessário
8. **CloseButton sempre absolute top-3 right-3 z-10**
9. **AriaHeading com slot="title"** para acessibilidade
10. **Use text-error-primary** para ícones de erro/exclusão

## Tamanhos de Modal

| Classe | Largura | Uso |
|--------|---------|-----|
| `sm:max-w-80` | 320px | Confirmações simples |
| `sm:max-w-120` | 480px | Formulários padrão (recomendado) |
| `sm:max-w-160` | 640px | Formulários complexos |
| `sm:max-w-200` | 800px | Conteúdo extenso |

## Cores de Botões

| Color | Uso |
|-------|-----|
| `primary` | Ação principal (Salvar, Confirmar) |
| `secondary` | Ação secundária (Cancelar, Fechar) |
| `error` | Ação destrutiva (Excluir, Remover) |
| `link-color` | Ação terciária (links) |

## Referências

Veja exemplos completos em:
- `payment-processors.tsx` - Modais de configuração com formulários e upload
- `widgets.tsx` - Estrutura de modais (se aplicável)
