package com.delacruz.shoems.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping(value = {"/", "/shoes", "/admin"})
    public String forward() {
        return "forward:/angular/index.html";
    }
}

