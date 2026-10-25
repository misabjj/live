<?php

return [
    'reset_password' => [
        'title' => 'Redefinir senha',
        'subtitle' => 'Por favor, insira sua nova senha abaixo',
        'fields' => [
            'email' => [
                'label' => 'E-mail',
            ],
            'password' => [
                'label' => 'Senha',
                'placeholder' => 'Insira sua nova senha',
            ],
            'password_confirmation' => [
                'label' => 'Confirmar senha',
                'placeholder' => 'Confirme sua nova senha',
            ],
        ],
        'buttons' => [
            'reset' => 'Redefinir senha',
        ],
    ],
];
