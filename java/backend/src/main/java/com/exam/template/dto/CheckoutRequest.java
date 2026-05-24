package com.exam.template.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

/**
 * Checkout request containing a list of items.
 */
public class CheckoutRequest {

    @NotEmpty(message = "Cart must not be empty")
    @Valid
    private List<CheckoutItemRequest> items;

    // ---- Getters & Setters ----

    public List<CheckoutItemRequest> getItems() { return items; }
    public void setItems(List<CheckoutItemRequest> items) { this.items = items; }
}
