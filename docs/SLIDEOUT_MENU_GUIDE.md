# Guia de SlideoutMenu

Este guia mostra como criar slideout menus (painéis laterais) usando os componentes do sistema de design.

**Outros padrões de configurações:**
- [Form-Based Settings](./SETTINGS_PAGE_GUIDE.md) - Para formulários de edição (perfil, conta)
- [Card-Based Settings](./CARD_BASED_SETTINGS_GUIDE.md) - Para listas de integrações/recursos em cards
- [Seções de Configurações](./SETTINGS_SECTIONS_GUIDE.md) - Para páginas com ações individuais e separadores
- [Dialog/Modal](./DIALOG_MODAL_GUIDE.md) - Para modais de configuração

## O que é um SlideoutMenu?

Um SlideoutMenu é um painel lateral que desliza da direita da tela, sobrepondo o conteúdo principal. É ideal para:
- Formulários secundários
- Detalhes de itens
- Gerenciamento de listas/filas
- Ações que não justificam uma nova página

## Anatomia de um SlideoutMenu

```tsx
import { SlideoutMenu } from '@/components/untitled-ui/application/slideout-menus/slideout-menu';
import { useState } from 'react';

<SlideoutMenu.Trigger isOpen={isOpen} onOpenChange={setIsOpen}>
    <SlideoutMenu isDismissable>
        <SlideoutMenu.Header onClose={() => setIsOpen(false)}>
            {/* Título e descrição */}
        </SlideoutMenu.Header>

        <SlideoutMenu.Content>
            {/* Conteúdo do slideout */}
        </SlideoutMenu.Content>

        <SlideoutMenu.Footer>
            {/* Ações (opcional) */}
        </SlideoutMenu.Footer>
    </SlideoutMenu>
</SlideoutMenu.Trigger>
```

## Componentes

### 1. SlideoutMenu.Trigger

Controla a abertura e fechamento do slideout.

**Props:**
- `isOpen: boolean` - Estado de abertura
- `onOpenChange: (isOpen: boolean) => void` - Callback quando o estado muda
- `children: ReactNode` - O SlideoutMenu em si

```tsx
<SlideoutMenu.Trigger isOpen={isOpen} onOpenChange={setIsOpen}>
    <SlideoutMenu>
        {/* ... */}
    </SlideoutMenu>
</SlideoutMenu.Trigger>
```

### 2. SlideoutMenu

Container principal do slideout.

**Props:**
- `isDismissable?: boolean` - Permite fechar clicando fora ou com ESC (padrão: true)
- `children: ReactNode` - Conteúdo (Header, Content, Footer)

```tsx
<SlideoutMenu isDismissable>
    {/* ... */}
</SlideoutMenu>
```

### 3. SlideoutMenu.Header

Cabeçalho do slideout com botão de fechar.

**Props:**
- `onClose: () => void` - Função chamada ao clicar no X
- `children: ReactNode` - Título e descrição

```tsx
<SlideoutMenu.Header onClose={() => setIsOpen(false)}>
    <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-primary">Título</h2>
        <p className="text-sm text-secondary">Descrição</p>
    </div>
</SlideoutMenu.Header>
```

### 4. SlideoutMenu.Content

Área de conteúdo principal, com scroll automático se necessário.

**Props:**
- `children: ReactNode` - Conteúdo do slideout

```tsx
<SlideoutMenu.Content>
    <div className="flex flex-col gap-4">
        {/* Seu conteúdo aqui */}
    </div>
</SlideoutMenu.Content>
```

### 5. SlideoutMenu.Footer (Opcional)

Rodapé fixo com ações.

**Props:**
- `children: ReactNode` - Botões de ação

```tsx
<SlideoutMenu.Footer>
    <div className="flex gap-3">
        <Button onClick={handleCancel}>Cancelar</Button>
        <Button onClick={handleSave}>Salvar</Button>
    </div>
</SlideoutMenu.Footer>
```

## Estrutura Básica

```tsx
import { SlideoutMenu } from '@/components/untitled-ui/application/slideout-menus/slideout-menu';
import { Button } from '@/components/untitled-ui/base/buttons/button';
import { useState } from 'react';

function Page() {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    return (
        <>
            <Button onClick={handleOpen}>Abrir Menu</Button>

            <SlideoutMenu.Trigger isOpen={isOpen} onOpenChange={setIsOpen}>
                <SlideoutMenu isDismissable>
                    <SlideoutMenu.Header onClose={handleClose}>
                        <div className="flex flex-col gap-1">
                            <h2 className="text-lg font-semibold text-primary">
                                Título do Slideout
                            </h2>
                            <p className="text-sm text-secondary">
                                Descrição do slideout
                            </p>
                        </div>
                    </SlideoutMenu.Header>

                    <SlideoutMenu.Content>
                        <div className="flex flex-col gap-4">
                            {/* Seu conteúdo aqui */}
                        </div>
                    </SlideoutMenu.Content>

                    <SlideoutMenu.Footer>
                        <div className="flex gap-3">
                            <Button color="secondary" onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button color="primary" onClick={handleSave}>
                                Salvar
                            </Button>
                        </div>
                    </SlideoutMenu.Footer>
                </SlideoutMenu>
            </SlideoutMenu.Trigger>
        </>
    );
}
```

## Padrões de Uso

### 1. Lista de Itens

Exibir uma lista de itens com ações individuais.

```tsx
import { SlideoutMenu } from '@/components/untitled-ui/application/slideout-menus/slideout-menu';
import { Button } from '@/components/untitled-ui/base/buttons/button';

<SlideoutMenu.Trigger isOpen={isOpen} onOpenChange={setIsOpen}>
    <SlideoutMenu isDismissable>
        <SlideoutMenu.Header onClose={handleClose}>
            <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-primary">
                    Fila de alertas
                </h2>
                <p className="text-sm text-secondary">
                    Gerencie a fila de alertas de doações
                </p>
            </div>
        </SlideoutMenu.Header>

        <SlideoutMenu.Content>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-primary">
                        {items.length} itens na fila
                    </p>
                    <Button size="sm" onClick={handleSkip}>
                        Pular
                    </Button>
                </div>

                {items.length === 0 ? (
                    <div className="rounded-lg border border-border-secondary bg-secondary p-8 text-center">
                        <p className="text-sm text-secondary">
                            Nenhum item na fila
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-lg border border-border-secondary bg-secondary p-4"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-primary">
                                            {item.title}
                                        </p>
                                        <p className="text-sm text-secondary">
                                            {item.description}
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => handleAction(item.id)}
                                    >
                                        Ação
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </SlideoutMenu.Content>
    </SlideoutMenu>
</SlideoutMenu.Trigger>
```

**Exemplo real:** `controls.tsx` - Fila de alertas de doações

### 2. Formulário

Slideout com formulário para edição ou criação.

```tsx
import { SlideoutMenu } from '@/components/untitled-ui/application/slideout-menus/slideout-menu';
import { Button } from '@/components/untitled-ui/base/buttons/button';
import { Input } from '@/components/untitled-ui/base/input/input';
import { Form } from '@/components/untitled-ui/base/form/form';
import { useForm } from '@inertiajs/react';

function Page() {
    const [isOpen, setIsOpen] = useState(false);

    const form = useForm({
        name: '',
        email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('items.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsOpen(false);
                form.reset();
            },
        });
    };

    return (
        <SlideoutMenu.Trigger isOpen={isOpen} onOpenChange={setIsOpen}>
            <SlideoutMenu isDismissable>
                <SlideoutMenu.Header onClose={() => setIsOpen(false)}>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-semibold text-primary">
                            Adicionar item
                        </h2>
                        <p className="text-sm text-secondary">
                            Preencha os dados do novo item
                        </p>
                    </div>
                </SlideoutMenu.Header>

                <Form onSubmit={handleSubmit}>
                    <SlideoutMenu.Content>
                        <div className="flex flex-col gap-4">
                            <Input
                                label="Nome"
                                value={form.data.name}
                                onChange={(value) => form.setData('name', value)}
                                hint={form.errors.name}
                                isInvalid={!!form.errors.name}
                                isRequired
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={form.data.email}
                                onChange={(value) => form.setData('email', value)}
                                hint={form.errors.email}
                                isInvalid={!!form.errors.email}
                                isRequired
                            />
                        </div>
                    </SlideoutMenu.Content>

                    <SlideoutMenu.Footer>
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                color="secondary"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                color="primary"
                                isDisabled={form.processing}
                            >
                                Salvar
                            </Button>
                        </div>
                    </SlideoutMenu.Footer>
                </Form>
            </SlideoutMenu>
        </SlideoutMenu.Trigger>
    );
}
```

### 3. Detalhes de Item

Exibir informações detalhadas de um item.

```tsx
<SlideoutMenu.Trigger isOpen={isOpen} onOpenChange={setIsOpen}>
    <SlideoutMenu isDismissable>
        <SlideoutMenu.Header onClose={handleClose}>
            <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-primary">
                    Detalhes da doação
                </h2>
                <p className="text-sm text-secondary">
                    Informações completas da doação
                </p>
            </div>
        </SlideoutMenu.Header>

        <SlideoutMenu.Content>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-medium text-secondary">Doador</p>
                    <p className="text-sm font-semibold text-primary">
                        {donation.donor_name}
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <p className="text-xs font-medium text-secondary">Valor</p>
                    <p className="text-sm font-semibold text-primary">
                        {donation.currency} {donation.amount.toFixed(2)}
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <p className="text-xs font-medium text-secondary">Mensagem</p>
                    <p className="text-sm text-primary">
                        {donation.message || 'Sem mensagem'}
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <p className="text-xs font-medium text-secondary">Data</p>
                    <p className="text-sm text-primary">
                        {new Date(donation.created_at).toLocaleString()}
                    </p>
                </div>
            </div>
        </SlideoutMenu.Content>

        <SlideoutMenu.Footer>
            <div className="flex justify-end gap-3">
                <Button color="secondary" onClick={handleClose}>
                    Fechar
                </Button>
                <Button color="primary" onClick={handleExport}>
                    Exportar
                </Button>
            </div>
        </SlideoutMenu.Footer>
    </SlideoutMenu>
</SlideoutMenu.Trigger>
```

### 4. Filtros

Slideout com opções de filtro.

```tsx
<SlideoutMenu.Trigger isOpen={isOpen} onOpenChange={setIsOpen}>
    <SlideoutMenu isDismissable>
        <SlideoutMenu.Header onClose={handleClose}>
            <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-primary">Filtros</h2>
                <p className="text-sm text-secondary">
                    Refine sua pesquisa
                </p>
            </div>
        </SlideoutMenu.Header>

        <SlideoutMenu.Content>
            <div className="flex flex-col gap-4">
                <Select
                    label="Status"
                    value={filters.status}
                    onChange={(value) => setFilters({ ...filters, status: value })}
                    options={[
                        { value: 'all', label: 'Todos' },
                        { value: 'active', label: 'Ativos' },
                        { value: 'inactive', label: 'Inativos' },
                    ]}
                />

                <Select
                    label="Categoria"
                    value={filters.category}
                    onChange={(value) => setFilters({ ...filters, category: value })}
                    options={categories}
                />

                <Input
                    label="Data inicial"
                    type="date"
                    value={filters.startDate}
                    onChange={(value) => setFilters({ ...filters, startDate: value })}
                />

                <Input
                    label="Data final"
                    type="date"
                    value={filters.endDate}
                    onChange={(value) => setFilters({ ...filters, endDate: value })}
                />
            </div>
        </SlideoutMenu.Content>

        <SlideoutMenu.Footer>
            <div className="flex gap-3">
                <Button color="secondary" onClick={handleClearFilters}>
                    Limpar
                </Button>
                <Button color="primary" onClick={handleApplyFilters}>
                    Aplicar
                </Button>
            </div>
        </SlideoutMenu.Footer>
    </SlideoutMenu>
</SlideoutMenu.Trigger>
```

### 5. Sem Footer

Slideout simples sem ações no rodapé.

```tsx
<SlideoutMenu.Trigger isOpen={isOpen} onOpenChange={setIsOpen}>
    <SlideoutMenu isDismissable>
        <SlideoutMenu.Header onClose={handleClose}>
            <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-primary">
                    Notificações
                </h2>
                <p className="text-sm text-secondary">
                    Suas notificações recentes
                </p>
            </div>
        </SlideoutMenu.Header>

        <SlideoutMenu.Content>
            <div className="flex flex-col gap-3">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className="rounded-lg border border-border-secondary bg-secondary p-4"
                    >
                        <p className="text-sm font-semibold text-primary">
                            {notification.title}
                        </p>
                        <p className="text-sm text-secondary">
                            {notification.message}
                        </p>
                        <p className="mt-2 text-xs text-tertiary">
                            {notification.time}
                        </p>
                    </div>
                ))}
            </div>
        </SlideoutMenu.Content>
    </SlideoutMenu>
</SlideoutMenu.Trigger>
```

## Gerenciamento de Estado

### Estado Básico

```tsx
const [isOpen, setIsOpen] = useState(false);

const handleOpen = () => setIsOpen(true);
const handleClose = () => setIsOpen(false);
```

### Com Dados Dinâmicos

```tsx
const [selectedItem, setSelectedItem] = useState<Item | null>(null);

const handleOpenWithItem = (item: Item) => {
    setSelectedItem(item);
};

const handleClose = () => {
    setSelectedItem(null);
};

<SlideoutMenu.Trigger
    isOpen={selectedItem !== null}
    onOpenChange={(open) => !open && handleClose()}
>
    <SlideoutMenu isDismissable>
        {/* Use selectedItem nos dados */}
    </SlideoutMenu>
</SlideoutMenu.Trigger>
```

### Múltiplos Slideouts

```tsx
const [activeSlideout, setActiveSlideout] = useState<string | null>(null);

const handleOpenSlideout1 = () => setActiveSlideout('slideout1');
const handleOpenSlideout2 = () => setActiveSlideout('slideout2');
const handleClose = () => setActiveSlideout(null);

<SlideoutMenu.Trigger
    isOpen={activeSlideout === 'slideout1'}
    onOpenChange={(open) => !open && handleClose()}
>

<SlideoutMenu.Trigger
    isOpen={activeSlideout === 'slideout2'}
    onOpenChange={(open) => !open && handleClose()}
>
```

## Interação com Backend

### Submit de Formulário

```tsx
const form = useForm({
    field1: '',
    field2: '',
});

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.post(route('items.store'), {
        preserveScroll: true,
        onSuccess: () => {
            setIsOpen(false);
            form.reset();
        },
    });
};
```

### Ação Individual

```tsx
const handleAction = (itemId: string) => {
    router.post(
        route('items.action', { item: itemId }),
        {},
        {
            preserveScroll: true,
            onSuccess: () => {
                // Opcional: fechar o slideout
                setIsOpen(false);
            },
        }
    );
};
```

### Atualização em Tempo Real (WebSockets)

```tsx
import { useEchoPublic } from '@laravel/echo-react';

const [items, setItems] = useState<Item[]>(initialItems);

useEchoPublic(`channel.${channelId}`, '.ItemAdded', (event: any) => {
    setItems((prev) => [...prev, event.item]);
});

useEchoPublic(`channel.${channelId}`, '.ItemRemoved', (event: any) => {
    setItems((prev) => prev.filter((item) => item.id !== event.itemId));
});
```

**Exemplo real:** `controls.tsx` - Fila de alertas atualizada em tempo real

## Estilos de Conteúdo

### Empty State

```tsx
{items.length === 0 ? (
    <div className="rounded-lg border border-border-secondary bg-secondary p-8 text-center">
        <p className="text-sm text-secondary">
            Nenhum item encontrado
        </p>
    </div>
) : (
    // Lista de itens
)}
```

### Lista de Cards

```tsx
<div className="flex flex-col gap-3">
    {items.map((item) => (
        <div
            key={item.id}
            className="rounded-lg border border-border-secondary bg-secondary p-4"
        >
            {/* Conteúdo do card */}
        </div>
    ))}
</div>
```

### Grid de Informações

```tsx
<div className="flex flex-col gap-6">
    <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-secondary">Label</p>
        <p className="text-sm font-semibold text-primary">Valor</p>
    </div>

    <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-secondary">Label</p>
        <p className="text-sm font-semibold text-primary">Valor</p>
    </div>
</div>
```

## Largura do Slideout

O slideout tem largura fixa baseada no breakpoint:

- **Mobile:** Largura total da tela
- **Desktop (sm+):** 448px (max-w-112)

Para customizar a largura, você precisaria modificar o componente base do SlideoutMenu.

## Exemplo Completo

Exemplo baseado em `controls.tsx`:

```tsx
import { SlideoutMenu } from '@/components/untitled-ui/application/slideout-menus/slideout-menu';
import { Button } from '@/components/untitled-ui/base/buttons/button';
import { router } from '@inertiajs/react';
import { useEchoPublic } from '@laravel/echo-react';
import { PlayCircle, SkipForward } from '@untitledui/icons';
import { useState } from 'react';

interface Donation {
    id: string;
    donor_name: string;
    amount: number;
    currency: string;
    content_text: string | null;
}

interface Props {
    unplayed_donations: Donation[];
    widget_token: string;
}

function Page({ unplayed_donations, widget_token }: Props) {
    const [isQueueSlideoutOpen, setIsQueueSlideoutOpen] = useState(false);
    const [donations, setDonations] = useState<Donation[]>(unplayed_donations);
    const [isProcessing, setIsProcessing] = useState(false);

    // Atualização em tempo real
    useEchoPublic(`widgets.${widget_token}`, '.DonationAlertPlayed', (event: any) => {
        setDonations((prev) => prev.filter((d) => d.id !== event.donation_id));
    });

    useEchoPublic(`widgets.${widget_token}`, '.DonationAlert', (event: any) => {
        if (event.donation?.id) {
            setDonations((prev) => {
                if (prev.some((d) => d.id === event.donation.id)) {
                    return prev;
                }
                return [...prev, event.donation];
            });
        }
    });

    const handleSkipAlert = () => {
        if (isProcessing) return;
        setIsProcessing(true);
        router.post(
            route('controls.skip-donation-alert'),
            {},
            {
                preserveScroll: true,
                onFinish: () => setIsProcessing(false),
            }
        );
    };

    const handlePlayDonation = (donationId: string) => {
        if (isProcessing) return;
        setIsProcessing(true);
        router.post(
            route('controls.play-donation', { donation: donationId }),
            {},
            {
                preserveScroll: true,
                onFinish: () => setIsProcessing(false),
            }
        );
    };

    return (
        <>
            <Button
                size="md"
                iconLeading={SkipForward}
                onClick={() => setIsQueueSlideoutOpen(true)}
            >
                Fila
            </Button>

            <SlideoutMenu.Trigger
                isOpen={isQueueSlideoutOpen}
                onOpenChange={setIsQueueSlideoutOpen}
            >
                <SlideoutMenu isDismissable>
                    <SlideoutMenu.Header onClose={() => setIsQueueSlideoutOpen(false)}>
                        <div className="flex flex-col gap-1">
                            <h2 className="text-lg font-semibold text-primary">
                                Fila de alertas
                            </h2>
                            <p className="text-sm text-secondary">
                                Gerencie a fila de alertas de doações
                            </p>
                        </div>
                    </SlideoutMenu.Header>

                    <SlideoutMenu.Content>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-primary">
                                    {donations.length}{' '}
                                    {donations.length === 1 ? 'alerta na fila' : 'alertas na fila'}
                                </p>

                                <Button
                                    size="sm"
                                    iconLeading={SkipForward}
                                    onClick={handleSkipAlert}
                                    isDisabled={isProcessing}
                                >
                                    Pular
                                </Button>
                            </div>

                            {donations.length === 0 ? (
                                <div className="rounded-lg border border-border-secondary bg-secondary p-8 text-center">
                                    <p className="text-sm text-secondary">
                                        Nenhum alerta na fila
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {donations.map((donation) => (
                                        <div
                                            key={donation.id}
                                            className="rounded-lg border border-border-secondary bg-secondary p-4"
                                        >
                                            <div className="mb-2 flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-primary">
                                                        {donation.donor_name}
                                                    </p>
                                                    <p className="text-brand text-sm font-medium">
                                                        {donation.currency} {donation.amount.toFixed(2)}
                                                    </p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    iconLeading={PlayCircle}
                                                    onClick={() => handlePlayDonation(donation.id)}
                                                    isDisabled={isProcessing}
                                                >
                                                    Reproduzir
                                                </Button>
                                            </div>
                                            {donation.content_text && (
                                                <p className="mt-2 text-sm text-secondary">
                                                    {donation.content_text}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </SlideoutMenu.Content>
                </SlideoutMenu>
            </SlideoutMenu.Trigger>
        </>
    );
}
```

## Checklist

- [ ] Importar componentes do SlideoutMenu
- [ ] Criar estado de controle (isOpen ou selectedItem)
- [ ] Adicionar botão/trigger para abrir
- [ ] Criar SlideoutMenu.Trigger com isOpen e onOpenChange
- [ ] Adicionar SlideoutMenu com isDismissable
- [ ] Implementar SlideoutMenu.Header com título e onClose
- [ ] Adicionar SlideoutMenu.Content com conteúdo
- [ ] Adicionar SlideoutMenu.Footer se necessário
- [ ] Implementar handlers de ações
- [ ] Testar abertura e fechamento
- [ ] Testar ESC e clique fora (isDismissable)
- [ ] Testar scroll do conteúdo
- [ ] Testar responsividade

## Dicas

1. **isDismissable**: Sempre use `true` para melhor UX
2. **onOpenChange**: Use para sincronizar estado externo
3. **Header sempre tem onClose**: Mesmo com isDismissable, adicione onClose no Header
4. **Gap no Content**: Use `flex flex-col gap-4` ou `gap-3` para espaçamento consistente
5. **Empty State**: Sempre mostre mensagem quando não há dados
6. **isProcessing**: Desabilite botões durante ações para evitar cliques múltiplos
7. **preserveScroll**: Use nas chamadas do router para manter posição da página
8. **Scroll automático**: O Content tem scroll automático quando conteúdo é maior que a tela
9. **Footer fixo**: O Footer fica fixo no bottom mesmo com scroll no Content
10. **WebSockets**: Use `useEchoPublic` ou `useEcho` para atualizações em tempo real

## Diferenças do Modal

| Característica | SlideoutMenu | Modal |
|---------------|--------------|-------|
| **Posição** | Lateral direita | Centro da tela |
| **Animação** | Desliza da direita | Fade in |
| **Largura** | Fixa (448px) | Variável (max-w-*) |
| **Uso típico** | Listas, filas, filtros | Formulários rápidos, confirmações |
| **Scroll** | Content tem scroll | Modal inteiro tem scroll |
| **Footer** | Fixo no bottom | Fixo no bottom |
| **Mobile** | Largura total | Largura total |

## Quando Usar

### Use SlideoutMenu quando:
- Exibir listas ou filas de itens
- Gerenciar itens em tempo real
- Filtros complexos
- Detalhes de itens da lista
- Ações secundárias que não justificam nova página

### Use Modal quando:
- Formulários rápidos de criação/edição
- Confirmações importantes
- Avisos e notificações
- Ações principais que precisam de foco total

## Referências

Veja exemplo completo em:
- `resources/js/pages/streamers/controls.tsx` - Fila de alertas com WebSockets
