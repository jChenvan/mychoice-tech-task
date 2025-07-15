from django.db import models

class Item(models.Model):
    name = models.CharField(max_length=100)
    group = models.TextField(blank=True, choices=[
        ("PRIMARY", "Primary"),
        ("SECONDARY", "Secondary")
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
