package com.delacruz.shoems.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoaderConfig implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataLoaderConfig.class);

    @Override
    public void run(String... args) throws Exception {
        logger.info("Application started successfully.");
    }
}

