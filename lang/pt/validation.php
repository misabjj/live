<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => 'O campo :attribute deve ser aceito.',
    'accepted_if' => 'O campo :attribute deve ser aceito quando :other é :value.',
    'active_url' => 'O campo :attribute deve ser uma URL válida.',
    'after' => 'O campo :attribute deve ser uma data após :date.',
    'after_or_equal' => 'O campo :attribute deve ser uma data após ou igual a :date.',
    'alpha' => 'O campo :attribute deve conter apenas letras.',
    'alpha_dash' => 'O campo :attribute deve conter apenas letras, números, hífens e sublinhados.',
    'alpha_num' => 'O campo :attribute deve conter apenas letras e números.',
    'any_of' => 'O campo :attribute é inválido.',
    'array' => 'O campo :attribute deve ser um array.',
    'ascii' => 'O campo :attribute deve conter apenas caracteres alfanuméricos de um byte e símbolos.',
    'before' => 'O campo :attribute deve ser uma data anterior a :date.',
    'before_or_equal' => 'O campo :attribute deve ser uma data anterior ou igual a :date.',
    'between' => [
        'array' => 'O campo :attribute deve ter entre :min e :max itens.',
        'file' => 'O campo :attribute deve ter entre :min e :max kilobytes.',
        'numeric' => 'O campo :attribute deve estar entre :min e :max.',
        'string' => 'O campo :attribute deve ter entre :min e :max caracteres.',
    ],
    'boolean' => 'O campo :attribute deve ser verdadeiro ou falso.',
    'can' => 'O campo :attribute contém um valor não autorizado.',
    'confirmed' => 'A confirmação do campo :attribute não corresponde.',
    'contains' => 'O campo :attribute está faltando um valor obrigatório.',
    'current_password' => 'A senha está incorreta.',
    'date' => 'O campo :attribute deve ser uma data válida.',
    'date_equals' => 'O campo :attribute deve ser uma data igual a :date.',
    'date_format' => 'O campo :attribute deve corresponder ao formato :format.',
    'decimal' => 'O campo :attribute deve ter :decimal casas decimais.',
    'declined' => 'O campo :attribute deve ser recusado.',
    'declined_if' => 'O campo :attribute deve ser recusado quando :other é :value.',
    'different' => 'Os campos :attribute e :other devem ser diferentes.',
    'digits' => 'O campo :attribute deve ter :digits dígitos.',
    'digits_between' => 'O campo :attribute deve ter entre :min e :max dígitos.',
    'dimensions' => 'O campo :attribute tem dimensões de imagem inválidas.',
    'distinct' => 'O campo :attribute tem um valor duplicado.',
    'doesnt_end_with' => 'O campo :attribute não deve terminar com um dos seguintes: :values.',
    'doesnt_start_with' => 'O campo :attribute não deve começar com um dos seguintes: :values.',
    'email' => 'O campo :attribute deve ser um endereço de e-mail válido.',
    'ends_with' => 'O campo :attribute deve terminar com um dos seguintes: :values.',
    'enum' => 'O :attribute selecionado é inválido.',
    'exists' => 'O :attribute selecionado é inválido.',
    'extensions' => 'O campo :attribute deve ter uma das seguintes extensões: :values.',
    'file' => 'O campo :attribute deve ser um arquivo.',
    'filled' => 'O campo :attribute deve ter um valor.',
    'gt' => [
        'array' => 'O campo :attribute deve ter mais de :value itens.',
        'file' => 'O campo :attribute deve ser maior que :value kilobytes.',
        'numeric' => 'O campo :attribute deve ser maior que :value.',
        'string' => 'O campo :attribute deve ter mais de :value caracteres.',
    ],
    'gte' => [
        'array' => 'O campo :attribute deve ter :value itens ou mais.',
        'file' => 'O campo :attribute deve ser maior ou igual a :value kilobytes.',
        'numeric' => 'O campo :attribute deve ser maior ou igual a :value.',
        'string' => 'O campo :attribute deve ter :value caracteres ou mais.',
    ],
    'hex_color' => 'O campo :attribute deve ser uma cor hexadecimal válida.',
    'image' => 'O campo :attribute deve ser uma imagem.',
    'in' => 'O :attribute selecionado é inválido.',
    'in_array' => 'O campo :attribute deve existir em :other.',
    'in_array_keys' => 'O campo :attribute deve conter pelo menos uma das seguintes chaves: :values.',
    'integer' => 'O campo :attribute deve ser um inteiro.',
    'ip' => 'O campo :attribute deve ser um endereço IP válido.',
    'ipv4' => 'O campo :attribute deve ser um endereço IPv4 válido.',
    'ipv6' => 'O campo :attribute deve ser um endereço IPv6 válido.',
    'json' => 'O campo :attribute deve ser uma string JSON válida.',
    'list' => 'O campo :attribute deve ser uma lista.',
    'lowercase' => 'O campo :attribute deve estar em minúsculas.',
    'lt' => [
        'array' => 'O campo :attribute deve ter menos de :value itens.',
        'file' => 'O campo :attribute deve ser menor que :value kilobytes.',
        'numeric' => 'O campo :attribute deve ser menor que :value.',
        'string' => 'O campo :attribute deve ter menos de :value caracteres.',
    ],
    'lte' => [
        'array' => 'O campo :attribute não deve ter mais de :value itens.',
        'file' => 'O campo :attribute deve ser menor ou igual a :value kilobytes.',
        'numeric' => 'O campo :attribute deve ser menor ou igual a :value.',
        'string' => 'O campo :attribute deve ter no máximo :value caracteres.',
    ],
    'mac_address' => 'O campo :attribute deve ser um endereço MAC válido.',
    'max' => [
        'array' => 'O campo :attribute não deve ter mais de :max itens.',
        'file' => 'O campo :attribute não deve ser maior que :max kilobytes.',
        'numeric' => 'O campo :attribute não deve ser maior que :max.',
        'string' => 'O campo :attribute não deve ter mais de :max caracteres.',
    ],
    'max_digits' => 'O campo :attribute não deve ter mais de :max dígitos.',
    'mimes' => 'O campo :attribute deve ser um arquivo do tipo: :values.',
    'mimetypes' => 'O campo :attribute deve ser um arquivo do tipo: :values.',
    'min' => [
        'array' => 'O campo :attribute deve ter pelo menos :min itens.',
        'file' => 'O campo :attribute deve ter pelo menos :min kilobytes.',
        'numeric' => 'O campo :attribute deve ser pelo menos :min.',
        'string' => 'O campo :attribute deve ter pelo menos :min caracteres.',
    ],
    'min_digits' => 'O campo :attribute deve ter pelo menos :min dígitos.',
    'missing' => 'O campo :attribute deve estar faltando.',
    'missing_if' => 'O campo :attribute deve estar faltando quando :other é :value.',
    'missing_unless' => 'O campo :attribute deve estar faltando a menos que :other seja :value.',
    'missing_with' => 'O campo :attribute deve estar faltando quando :values está presente.',
    'missing_with_all' => 'O campo :attribute deve estar faltando quando :values estão presentes.',
    'multiple_of' => 'O campo :attribute deve ser um múltiplo de :value.',
    'not_in' => 'O :attribute selecionado é inválido.',
    'not_regex' => 'O formato do campo :attribute é inválido.',
    'numeric' => 'O campo :attribute deve ser um número.',
    'password' => [
        'letters' => 'O campo :attribute deve conter pelo menos uma letra.',
        'mixed' => 'O campo :attribute deve conter pelo menos uma letra maiúscula e uma minúscula.',
        'numbers' => 'O campo :attribute deve conter pelo menos um número.',
        'symbols' => 'O campo :attribute deve conter pelo menos um símbolo.',
        'uncompromised' => 'O :attribute fornecido apareceu em um vazamento de dados. Escolha um :attribute diferente.',
    ],
    'present' => 'O campo :attribute deve estar presente.',
    'present_if' => 'O campo :attribute deve estar presente quando :other é :value.',
    'present_unless' => 'O campo :attribute deve estar presente a menos que :other seja :value.',
    'present_with' => 'O campo :attribute deve estar presente quando :values está presente.',
    'present_with_all' => 'O campo :attribute deve estar presente quando :values estão presentes.',
    'prohibited' => 'O campo :attribute é proibido.',
    'prohibited_if' => 'O campo :attribute é proibido quando :other é :value.',
    'prohibited_if_accepted' => 'O campo :attribute é proibido quando :other é aceito.',
    'prohibited_if_declined' => 'O campo :attribute é proibido quando :other é recusado.',
    'prohibited_unless' => 'O campo :attribute é proibido a menos que :other esteja em :values.',
    'prohibits' => 'O campo :attribute proíbe :other de estar presente.',
    'regex' => 'O formato do campo :attribute é inválido.',
    'required' => 'O campo :attribute é obrigatório.',
    'required_array_keys' => 'O campo :attribute deve conter entradas para: :values.',
    'required_if' => 'O campo :attribute é obrigatório quando :other é :value.',
    'required_if_accepted' => 'O campo :attribute é obrigatório quando :other é aceito.',
    'required_if_declined' => 'O campo :attribute é obrigatório quando :other é recusado.',
    'required_unless' => 'O campo :attribute é obrigatório a menos que :other esteja em :values.',
    'required_with' => 'O campo :attribute é obrigatório quando :values está presente.',
    'required_with_all' => 'O campo :attribute é obrigatório quando :values estão presentes.',
    'required_without' => 'O campo :attribute é obrigatório quando :values não está presente.',
    'required_without_all' => 'O campo :attribute é obrigatório quando nenhum de :values está presente.',
    'same' => 'O campo :attribute deve corresponder a :other.',
    'size' => [
        'array' => 'O campo :attribute deve conter :size itens.',
        'file' => 'O campo :attribute deve ter :size kilobytes.',
        'numeric' => 'O campo :attribute deve ser :size.',
        'string' => 'O campo :attribute deve ter :size caracteres.',
    ],
    'starts_with' => 'O campo :attribute deve começar com um dos seguintes: :values.',
    'string' => 'O campo :attribute deve ser uma string.',
    'timezone' => 'O campo :attribute deve ser um timezone válido.',
    'unique' => 'O :attribute já foi utilizado.',
    'uploaded' => 'O :attribute falhou ao ser carregado.',
    'uppercase' => 'O campo :attribute deve estar em maiúsculas.',
    'url' => 'O campo :attribute deve ser uma URL válida.',
    'ulid' => 'O campo :attribute deve ser um ULID válido.',
    'uuid' => 'O campo :attribute deve ser um UUID válido.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'forms' => [
        'goal' => [
            'title' => ['required' => 'Título da meta é obrigatório.', 'min' => 'Título deve ter pelo menos 1 caractere.', 'max' => 'Título não pode exceder 255 caracteres.'],
            'target_amount' => ['required' => 'Valor meta é obrigatório.', 'numeric' => 'Valor meta deve ser um número válido.', 'min' => 'Valor meta deve ser maior que 0.', 'decimal' => 'Valor meta deve ter no máximo 2 casas decimais.'],
            'raised_amount' => ['numeric' => 'Valor arrecadado deve ser um número válido.', 'min' => 'Valor arrecadado deve ser maior ou igual a 0.', 'decimal' => 'Valor arrecadado deve ter no máximo 2 casas decimais.'],
            'closes_at' => ['required' => 'Data de encerramento é obrigatória.', 'date' => 'Data de encerramento deve estar em formato válido.', 'after' => 'Data de encerramento deve ser no futuro.'],
            'background_color' => ['required' => 'Cor de fundo é obrigatória.', 'regex' => 'Cor de fundo deve ser uma cor hexadecimal válida.'],
            'progress_bar_color' => ['required' => 'Cor da barra é obrigatória.', 'regex' => 'Cor da barra deve ser uma cor hexadecimal válida.'],
            'text_color' => ['required' => 'Cor do texto é obrigatório.', 'regex' => 'Cor do texto deve ser uma cor hexadecimal válida.'],
            'show_profile_link' => ['boolean' => 'Mostrar link do perfil deve ser verdadeiro ou falso.'],
        ],
        'profile_qr_code' => [
            'gradient_color_1' => ['required' => 'A primeira cor do gradiente é obrigatória.', 'regex' => 'A primeira cor do gradiente deve estar no formato hexadecimal (#RRGGBB).'],
            'gradient_color_2' => ['required' => 'A segunda cor do gradiente é obrigatória.', 'regex' => 'A segunda cor do gradiente deve estar no formato hexadecimal (#RRGGBB).'],
            'gradient_type' => ['required' => 'O tipo de gradiente é obrigatório.', 'enum' => 'O tipo de gradiente deve ser linear ou radial.'],
            'gradient_rotation' => ['required' => 'A rotação do gradiente é obrigatória.', 'integer' => 'A rotação do gradiente deve ser um número inteiro.', 'min' => 'A rotação do gradiente deve ser no mínimo 0 graus.', 'max' => 'A rotação do gradiente deve ser no máximo 360 graus.'],
            'dots_type' => ['required' => 'O tipo de pontos é obrigatório.', 'enum' => 'O tipo de pontos deve ser um dos valores válidos.'],
            'text_color' => ['required' => 'A cor do texto é obrigatória.', 'regex' => 'A cor do texto deve estar no formato hexadecimal (#RRGGBB).'],
            'background_color' => ['required' => 'A cor de fundo é obrigatória.', 'regex' => 'A cor de fundo deve estar no formato hexadecimal (#RRGGBB).'],
            'message' => ['max' => 'A mensagem deve ter no máximo 64 caracteres.'],
        ],
        'payment_processor' => [
            'processor' => ['required' => 'O processador de pagamento é obrigatório.', 'in' => 'O processador selecionado é inválido.', 'unique' => 'Este processador de pagamento já está configurado.'],
            'access_token' => ['required' => 'O token de acesso do Mercado Pago é obrigatório.', 'string' => 'O token de acesso deve ser um texto válido.', 'regex' => 'O token deve ter o formato válido do Mercado Pago (APP_USR-...). Apenas tokens de produção são permitidos.', 'min' => 'O token de acesso deve ter pelo menos 44 caracteres.'],
            'client_id' => ['required' => 'O ID do cliente EFI é obrigatório.'],
            'client_secret' => ['required' => 'O segredo do cliente EFI é obrigatório.'],
            'certificate' => ['required' => 'O certificado EFI é obrigatório.', 'mimes' => 'O certificado deve estar no formato P12 ou PEM.'],
            'secret_key' => ['required' => 'A chave secreta do Stripe é obrigatória.', 'string' => 'A chave secreta deve ser um texto válido.', 'regex' => 'A chave secreta deve ter o formato válido do Stripe (sk_live_...). Apenas chaves de produção são permitidas.', 'min' => 'A chave secreta do Stripe deve ter pelo menos 107 caracteres.'],
        ],
    ],

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [
        'email' => 'email',
        'password' => 'senha',
        'photo' => 'imagem',
        'display_name' => 'nome para exibição',
        'handle' => 'handle',
        'profile_photo' => 'foto do perfil',
        'background_image' => 'imagem de fundo',
        'background_color' => 'cor de fundo',
        'primary_color' => 'cor primária',
        'secondary_color' => 'cor secundária',
        'message_color' => 'cor da mensagem',
        'accept_donor_audio' => 'aceitar áudio do doador',
        'min_amount_text' => 'valor mínimo para texto',
        'min_amount_audio' => 'valor mínimo para áudio',
        'max_characters_text' => 'máximo de caracteres para texto',
        'max_audio_duration' => 'duração máxima de áudio',
        'title' => 'título',
        'target_amount' => 'valor meta',
        'raised_amount' => 'valor arrecadado',
        'closes_at' => 'data de encerramento',
        'progress_bar_color' => 'cor da barra',
        'text_color' => 'cor do texto',
        'show_profile_link' => 'mostrar link do perfil',
        'gradient_color_1' => 'primeira cor do gradiente',
        'gradient_color_2' => 'segunda cor do gradiente',
        'gradient_type' => 'tipo de gradiente',
        'gradient_rotation' => 'rotação do gradiente',
        'dots_type' => 'tipo de pontos',
        'message' => 'mensagem',
        'donor_name' => 'nome do doador',
        'content_type' => 'tipo de conteúdo',
        'payment_processor' => 'processador de pagamento',
        'payment_method' => 'método de pagamento',
        'content_text' => 'mensagem',
        'amount' => 'valor da doação',
        'audio_file' => 'arquivo de áudio',
    ],

];
