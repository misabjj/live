# Guia para Criar Páginas de Configurações Baseadas em Formulário

Este guia mostra como criar páginas de configurações baseadas em formulário usando os componentes padronizados.

**Outros padrões de configurações:**
- [Seções de Configurações](./SETTINGS_SECTIONS_GUIDE.md) - Para páginas com ações individuais e separadores
- [Card-Based Settings](./CARD_BASED_SETTINGS_GUIDE.md) - Para listas de integrações/recursos em cards
- [Dialog/Modal](./DIALOG_MODAL_GUIDE.md) - Para modais de configuração
- [SlideoutMenu](./SLIDEOUT_MENU_GUIDE.md) - Para painéis laterais

## Estrutura Básica

Toda página de configurações segue esta estrutura:

```tsx
import { FormSection, TextFormField } from '@/components/form-fields';
import { SettingsFormContainer, SettingsFormContent, SettingsFormFooter, SettingsPageHeader } from '@/components/settings';
import SettingsLayout from '@/layouts/settings-layout';
import { useForm } from '@inertiajs/react';
import { FormEvent, ReactNode } from 'react';

function Page({ /* suas props aqui */ }) {
    const form = useForm({
        // campos do formulário
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        form.put(route('sua.rota.aqui'), {
            preserveScroll: true,
        });
    };

    return (
        <SettingsFormContainer onSubmit={handleSubmit}>
            <SettingsPageHeader
                title="Título da Página"
                description="Descrição da página"
            />

            <SettingsFormContent>
                {/* Seus campos de formulário aqui */}
            </SettingsFormContent>

            <SettingsFormFooter isDirty={form.isDirty} isProcessing={form.processing} />
        </SettingsFormContainer>
    );
}

Page.layout = (page: ReactNode) => <SettingsLayout children={page} />;

export default Page;
```

## Quando Usar Este Padrão

Use este padrão quando você precisa:
- Editar dados de perfil/conta do usuário
- Formulário único com múltiplos campos interdependentes
- Submit salva todos os campos de uma vez
- Validação de todos os campos em conjunto

**Não use este padrão para:**
- Ações individuais por seção → Use [SETTINGS_SECTIONS_GUIDE.md](./SETTINGS_SECTIONS_GUIDE.md)
- Lista de integrações/recursos → Use [CARD_BASED_SETTINGS_GUIDE.md](./CARD_BASED_SETTINGS_GUIDE.md)

## Componentes Disponíveis

Todos os componentes estão em `@/components/settings` ou `@/components/form-fields`.

### 1. SettingsFormContainer

Envolve todo o formulário com padding e espaçamento adequados.

**Props:**
- `onSubmit: (e: FormEvent) => void` - Função chamada ao submeter o formulário
- `children: ReactNode` - Conteúdo do formulário

**Uso:**
```tsx
<SettingsFormContainer onSubmit={handleSubmit}>
    {/* conteúdo */}
</SettingsFormContainer>
```

### 2. SettingsPageHeader

Cabeçalho da página com título e descrição.

**Props:**
- `title: string` - Título da página
- `description: string` - Descrição/subtítulo da página

**Uso:**
```tsx
<SettingsPageHeader
    title="Configurações de Conta"
    description="Gerencie suas preferências de conta."
/>
```

### 3. SettingsFormContent

Envolve os campos do formulário com espaçamento vertical adequado.

**Props:**
- `children: ReactNode` - Campos do formulário

**Uso:**
```tsx
<SettingsFormContent>
    <FormSection>
        <TextFormField {...props} />
    </FormSection>
    <FormSection>
        <TextFormField {...props} />
    </FormSection>
</SettingsFormContent>
```

### 4. SettingsFormFooter

Rodapé do formulário com botão de submit.

**Props:**
- `submitLabel?: string` - Texto do botão (padrão: "Salvar")
- `isDirty?: boolean` - Se o formulário tem alterações (padrão: true). O botão fica desabilitado quando false
- `isProcessing?: boolean` - Se o formulário está sendo enviado (padrão: false). O botão fica desabilitado durante o envio

**Uso:**
```tsx
<SettingsFormFooter isDirty={form.isDirty} isProcessing={form.processing} />
// ou
<SettingsFormFooter submitLabel="Atualizar" isDirty={form.isDirty} isProcessing={form.processing} />
```

## Campos de Formulário Disponíveis

### TextFormField

Campo de texto simples.

```tsx
<FormSection>
    <TextFormField
        title="Nome"
        description="Seu nome completo" // opcional
        isRequired // opcional
        name="name"
        value={form.data.name}
        onChange={(value) => form.setData('name', value)}
        error={form.errors.name}
    />
</FormSection>
```

### AvatarFormField

Campo para upload de avatar/foto de perfil.

```tsx
<FormSection>
    <AvatarFormField
        title="Foto de perfil"
        description="Esta será exibida no seu perfil."
        isRequired
        src={user.profile_photo}
        onUpload={handleUpload}
        onDelete={handleDelete}
        error={form.errors.profile_photo}
        uploadButtonText="Atualizar"
        deleteButtonText="Deletar"
    />
</FormSection>
```

### ImageFormField

Campo para upload de imagens gerais.

```tsx
<FormSection>
    <ImageFormField
        title="Imagem de capa"
        description="Será exibida no topo da página."
        src={data.image}
        onUpload={handleUpload}
        onDelete={handleDelete}
        error={form.errors.image}
        uploadButtonText="Atualizar"
        deleteButtonText="Deletar"
        previewAlt="Prévia da imagem"
    />
</FormSection>
```

### ColorFormField

Campo para seleção de cor.

```tsx
<FormSection>
    <ColorFormField
        title="Cor do tema"
        description="Escolha sua cor preferida."
        value={form.data.color}
        onChange={(color) => form.setData('color', color)}
        error={form.errors.color}
        closeButtonText="Fechar"
    />
</FormSection>
```

## FormSection

Envolve cada campo ou grupo de campos. Adiciona separadores automaticamente.

**Importar de:** `@/components/form-fields`

**Props:**
- `withDivider?: boolean` - Se deve mostrar divisor abaixo (padrão: true)
- `children: ReactNode` - Conteúdo da seção

**Uso:**
```tsx
import { FormSection } from '@/components/form-fields';

<FormSection>
    <TextFormField {...props} />
</FormSection>

{/* Última seção sem divisor */}
<FormSection withDivider={false}>
    <TextFormField {...props} />
</FormSection>
```

**Nota:** FormSection adiciona um `<hr>` (separador horizontal) após o conteúdo se `withDivider={true}`. Isso é diferente de `SettingsSection` que usa o layout de duas colunas.

## Exemplo Completo

Veja o arquivo `profile.tsx` nesta pasta para um exemplo completo de implementação.

## Padrões de Upload de Arquivos

Para campos de upload, crie handlers separados:

```tsx
const handleUpload = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    router.post(
        route('sua.rota.store'),
        { photo: file },
        { preserveScroll: true }
    );
};

const handleDelete = () => {
    router.delete(
        route('sua.rota.destroy'),
        { preserveScroll: true }
    );
};
```

## Padrão de useForm

```tsx
const form = useForm({
    field1: initialValue1,
    field2: initialValue2,
    file_field: null as File | null,
});

// Para atualizar valores
form.setData('field1', newValue);

// Para submeter
form.put(route('sua.rota.update'), {
    preserveScroll: true,
});

// Acessar erros
form.errors.field1
```

## Checklist para Nova Página de Configurações

- [ ] Importar componentes de settings
- [ ] Importar FormSection e campos necessários
- [ ] Criar interface de Props se necessário
- [ ] Configurar useForm com campos iniciais
- [ ] Criar handleSubmit
- [ ] Estruturar com SettingsFormContainer
- [ ] Adicionar SettingsPageHeader com título e descrição
- [ ] Envolver campos com SettingsFormContent
- [ ] Cada campo dentro de FormSection
- [ ] Adicionar SettingsFormFooter
- [ ] Aplicar SettingsLayout
- [ ] Testar validação de erros
- [ ] Testar submit do formulário

## Dicas

1. **Sempre use FormSection** para envolver cada campo ou grupo de campos
2. **Última seção sem divisor**: Use `withDivider={false}` na última FormSection
3. **Campos obrigatórios**: Use a prop `isRequired` nos campos obrigatórios
4. **Uploads**: Crie handlers separados para upload e delete
5. **Erros**: Sempre passe `form.errors.field_name` para cada campo
6. **preserveScroll**: Use `{ preserveScroll: true }` nas chamadas do router para melhor UX

## Relação com Outros Padrões

### FormSection vs SettingsSection

| Característica | FormSection | SettingsSection |
|---------------|-------------|-----------------|
| **Importar de** | `@/components/form-fields` | `@/components/form-fields` |
| **Layout** | Wrapper simples | Grid de duas colunas |
| **Label** | Dentro dos form fields | Props title/description |
| **Separador** | `<hr>` após conteúdo | Componente separado (`SettingsSectionDivider`) |
| **Uso** | Formulários com form fields | Ações individuais, toggles, botões |

### Quando Usar Cada Um

**Use FormSection quando:**
- Usando form fields (TextFormField, AvatarFormField, etc.)
- Formulário com submit único
- Validação em conjunto

**Use SettingsSection quando:**
- Ações individuais por seção
- Toggles, botões, inputs simples
- Cada seção tem sua própria ação
- Veja: [SETTINGS_SECTIONS_GUIDE.md](./SETTINGS_SECTIONS_GUIDE.md)
