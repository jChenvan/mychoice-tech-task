from django.http import HttpResponse
from server.models import Item
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import datetime, timezone

@csrf_exempt
def all_items(request):
    if request.method == "GET":
        try:
            all_items = Item.objects.all()
            data = serializers.serialize("json", all_items)
            return HttpResponse(data, content_type="application/json", status=200)
        except TypeError as e:
            return HttpResponse(json.dumps({"error": str(e)}), content_type="application/json", status=400)
        except Exception as e:
            return HttpResponse(json.dumps({"error": "Server error", "details": str(e)}), content_type="application/json", status=500)
    if request.method == "POST":
        try:
            body_unicode = request.body.decode('utf-8')
            body_data = json.loads(body_unicode)
            if body_data["group"] not in ["PRIMARY", "SECONDARY"]:
                return HttpResponse(json.dumps({"error": "Invalid group"}), content_type="application/json", status=400)
            dupes = Item.objects.filter(group = body_data["group"], name = body_data["name"])
            if dupes.count() > 0:
                return HttpResponse(json.dumps({"error": "Item already exists"}), content_type="application/json", status=400)
            result = Item.objects.create(**body_data)
            created_item = serializers.serialize("json", [result])
            return HttpResponse(created_item, content_type="application/json", status=201)
        except json.JSONDecodeError:
            return HttpResponse(json.dumps({"error": "Invalid JSON"}), content_type="application/json", status=400)
        except TypeError as e:
            return HttpResponse(json.dumps({"error": str(e)}), content_type="application/json", status=400)
        except Exception as e:
            return HttpResponse(json.dumps({"error": "Server error", "details": str(e)}), content_type="application/json", status=500)

@csrf_exempt
def item(request, itemid):
    if request.method == "GET":
        try:
            result = Item.objects.filter(id=itemid)
            if len(result) == 0:
                return HttpResponse(json.dumps({"error": "Item not found"}), content_type="application/json", status=404)
            item = serializers.serialize("json", result)
            return HttpResponse(item, content_type="application/json")
        except Item.DoesNotExist:
            return HttpResponse(json.dumps({"error": "Item not found"}), content_type="application/json", status=404)
        except Exception as e:
            return HttpResponse(json.dumps({"error": "Server error", "details": str(e)}), content_type="application/json", status=500)
    if request.method == "PATCH":
        try:
            body_unicode = request.body.decode('utf-8')
            body_data = json.loads(body_unicode)
            dupes = Item.objects.filter(name = body_data["name"], group = body_data["group"])
            if len(dupes) > 0:
                return HttpResponse(json.dumps({"error": "Item already exists"}), content_type="application/json", status=400)
            obj = Item.objects.get(id=itemid)
            for key, value in body_data.items():
                if key == "name" or key == "group":
                    setattr(obj, key, value)
            setattr(obj, "updated_at", datetime.now(timezone.utc))
            obj.save()
            updated_item = serializers.serialize("json", [obj])
            return HttpResponse(updated_item, content_type="application/json")
        except Item.DoesNotExist:
            return HttpResponse(json.dumps({"error": "Item not found"}), content_type="application/json", status=404)
        except json.JSONDecodeError:
            return HttpResponse(json.dumps({"error": "Invalid JSON"}), content_type="application/json", status=400)
        except Exception as e:
            return HttpResponse(json.dumps({"error": "Server error", "details": str(e)}), content_type="application/json", status=500)
    if request.method == "DELETE":
        try:
            obj = Item.objects.get(id=itemid)
            deleted_item = serializers.serialize("json", [obj])
            obj.delete()
            return HttpResponse(deleted_item, content_type="application/json")
        except Item.DoesNotExist:
            return HttpResponse(json.dumps({"error": "Item not found"}), content_type="application/json", status=404)
        except Exception as e:
            return HttpResponse(json.dumps({"error": "Server error", "details": str(e)}), content_type="application/json", status=500)