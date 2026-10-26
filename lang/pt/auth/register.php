<?php

return [
    'title' => 'Criar conta',
    'subtitle' => 'Cadastre-se para começar a usar nossa plataforma.',
    'password_requirement' => 'Deve ter pelo menos 8 caracteres',
    'signin_prompt' => 'Já tem uma conta?',
    'fields' => [
        'display_name' => [
            'label' => 'Nome de exibição',
            'placeholder' => 'Digite seu nome',
        ],
        'email' => [
            'label' => 'E-mail',
            'placeholder' => 'Digite seu e-mail',
        ],
        'password' => [
            'label' => 'Senha',
            'placeholder' => 'Digite sua senha',
        ],
        'password_confirmation' => [
            'label' => 'Confirmar senha',
            'placeholder' => 'Confirme sua senha',
        ],
    ],
    'buttons' => [
        'register' => 'Criar conta',
        'processing' => 'Criando conta...',
        'login' => 'Já tem uma conta? Faça login',
    ],
];
