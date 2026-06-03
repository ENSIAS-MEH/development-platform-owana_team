package com.foundersync.startup_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class StartupServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(StartupServiceApplication.class, args);
	}

}
