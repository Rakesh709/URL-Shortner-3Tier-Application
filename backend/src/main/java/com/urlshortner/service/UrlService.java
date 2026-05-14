package com.urlshortner.service;

import com.urlshortner.dto.CreateUrlRequest;
import com.urlshortner.dto.UrlResponse;
import com.urlshortner.model.Url;
import com.urlshortner.repository.UrlRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UrlService {

    private final UrlRepository urlRepository;
    private static final String BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static final int SHORT_CODE_LENGTH = 6;
    private final Random random = new Random();

    @Transactional
    public UrlResponse createShortUrl(CreateUrlRequest request) {
        String shortCode = generateUniqueShortCode();
        LocalDateTime expiresAt = null;

        if (request.getExpiresInDays() != null && request.getExpiresInDays() > 0) {
            expiresAt = LocalDateTime.now().plusDays(request.getExpiresInDays());
        }

        Url url = Url.builder()
                .originalUrl(request.getOriginalUrl())
                .shortCode(shortCode)
                .expiresAt(expiresAt)
                .build();

        url = urlRepository.save(url);
        return toResponse(url);
    }

    public UrlResponse getUrlByCode(String shortCode) {
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("URL not found"));

        url.setClickCount(url.getClickCount() + 1);
        urlRepository.save(url);

        return toResponse(url);
    }

    public Url getOriginalUrl(String shortCode) {
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("URL not found"));

        if (url.getExpiresAt() != null && url.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("URL has expired");
        }

        url.setClickCount(url.getClickCount() + 1);
        urlRepository.save(url);

        return url;
    }

    public List<UrlResponse> getAllUrls() {
        return urlRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteUrl(String shortCode) {
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("URL not found"));
        urlRepository.delete(url);
    }

    private String generateUniqueShortCode() {
        String shortCode;
        do {
            shortCode = generateShortCode();
        } while (urlRepository.existsByShortCode(shortCode));
        return shortCode;
    }

    private String generateShortCode() {
        StringBuilder sb = new StringBuilder(SHORT_CODE_LENGTH);
        for (int i = 0; i < SHORT_CODE_LENGTH; i++) {
            sb.append(BASE62_CHARS.charAt(random.nextInt(BASE62_CHARS.length())));
        }
        return sb.toString();
    }

    private UrlResponse toResponse(Url url) {
        return UrlResponse.builder()
                .id(url.getId())
                .originalUrl(url.getOriginalUrl())
                .shortCode(url.getShortCode())
                .shortUrl("/r/" + url.getShortCode())
                .createdAt(url.getCreatedAt())
                .clickCount(url.getClickCount())
                .expiresAt(url.getExpiresAt())
                .build();
    }
}