<?php

return [
    'title' => 'Crear cuenta',
    'subtitle' => 'Regístrate para comenzar a usar nuestra plataforma.',
    'password_requirement' => 'Debe tener al menos 8 caracteres',
    'signin_prompt' => '¿Ya tienes una cuenta?',
    'fields' => [
        'display_name' => [
            'label' => 'Nombre de usuario',
            'placeholder' => 'Ingresa tu nombre',
        ],
        'email' => [
            'label' => 'Correo electrónico',
            'placeholder' => 'Ingresa tu correo electrónico',
        ],
        'password' => [
            'label' => 'Contraseña',
            'placeholder' => 'Ingresa tu contraseña',
        ],
        'password_confirmation' => [
            'label' => 'Confirmar contraseña',
            'placeholder' => 'Confirma tu contraseña',
        ],
    ],
    'buttons' => [
        'register' => 'Crear cuenta',
        'processing' => 'Creando cuenta...',
        'login' => '¿Ya tienes cuenta? Inicia sesión',
    ],
];
