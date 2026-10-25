<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('donations:check-expired')->everyMinute();
