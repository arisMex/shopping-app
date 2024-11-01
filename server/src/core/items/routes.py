from typing import List

from fastapi import APIRouter, Query

from .controllers import add_item, delete_item, get_item, get_items, get_item_by_barcode
from .schemas import AddItemSchema, ItemSchema

item_router = APIRouter(
    prefix="/items",
    tags=["Items"],
    responses={
        400: {"description": "Bad Request"},
        404: {"description": "Not found"},
    }
)


@item_router.post("/", response_model=ItemSchema)
def create_item(
    item: AddItemSchema,
):
    return add_item(item)


@item_router.get("/{item_id}", response_model=ItemSchema)
def read_item(
    item_id: int,
):
    return get_item(item_id)

@item_router.get("/barcode/{item_barcode}", response_model=ItemSchema)
def read_item_by_barcode(
    item_barcode: str,
):
    return get_item_by_barcode(item_barcode)


@item_router.get("/", response_model=List[ItemSchema])
def read_items(
    offset: int = 0,
    limit: int = Query(default=100, lte=100),
):
    return get_items(offset, limit)


@item_router.delete("/", response_model=ItemSchema)
def remove_item(
    item_id: int,
):
    return delete_item(item_id)
