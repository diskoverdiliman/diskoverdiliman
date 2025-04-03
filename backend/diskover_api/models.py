from django.db import models
from django.db import connection

# Create your models here.


class Category(models.Model):
    """This class and its functions wrap around the 'category' table in the
    Diskover's underlying database.
    """
    name = models.CharField(max_length=50)
    image = models.CharField(max_length=260, blank=True, null=True)
    url = models.CharField(max_length=50, blank=True, null=True)
    marker = models.CharField(max_length=260, blank=True, null=True)
    route_marker = models.CharField(max_length=260, blank=True, null=True)
    route_color = models.CharField(max_length=7, blank=True, null=True)

    class Meta:
        db_table = 'category'

    def __str__(self):
        return self.name


class Location(models.Model):
    """This class and its functions wrap around the 'location' table in the
    Diskover's underlying database.
    """
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    more_info = models.TextField(blank=True, null=True)
    lat = models.FloatField()
    lng = models.FloatField()
    url = models.CharField(max_length=100, blank=True, null=True)
    category = models.ForeignKey(
        Category, related_name='locations', on_delete=models.SET_NULL, blank=True, null=True)

    class Meta:
        db_table = 'location'

    def __str__(self):
        return self.name

    @classmethod
    def reset_id_sequence(cls):
        reset_value = cls.objects.order_by('pk').last().id + 1
        with connection.cursor() as cursor:
            cursor.execute(
                "ALTER SEQUENCE location_id_seq RESTART WITH %s", [reset_value])

class Image(models.Model):
    img_url = models.CharField(max_length=260, blank=False)
    location = models.ManyToManyField(Location, related_name='images')

    class Meta:
        db_table = 'image'

    def __str__(self):
        return self.img_url

    @classmethod
    def reset_id_sequence(cls):
        last_image = cls.objects.order_by('pk').last()
        reset_value = last_image.id + 1 if last_image else 1  # Handle empty table
        with connection.cursor() as cursor:
            cursor.execute(f"ALTER SEQUENCE {cls._meta.db_table}_id_seq RESTART WITH {reset_value}")


class Subarea(models.Model):
    sub = models.OneToOneField(
        Location, related_name='building', on_delete=models.CASCADE, primary_key=True)
    building = models.ForeignKey(
        Location, related_name='subareas', on_delete=models.CASCADE, blank=True, null=True)

    class Meta:
        db_table = 'subarea'

    def __str__(self):
        return f'Subarea of {self.sub.name}'


class Tag(models.Model):
    name = models.CharField(max_length=30)
    location = models.ManyToManyField(Location, related_name='tags')

    class Meta:
        db_table = 'tag'

    def __str__(self):
        return self.name
