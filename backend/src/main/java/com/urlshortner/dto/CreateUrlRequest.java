package com.urlshortner.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateUrlRequest {
    @NotBlank(message = "URL is required")
    private String originalUrl;
    private Integer expiresInDays;
}