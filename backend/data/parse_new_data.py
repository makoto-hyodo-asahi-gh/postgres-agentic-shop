"""
This scripts processes the CSV file that contains all the data to create seperate CSV files for each table
of the database.

"""

import ast
import csv
import json
import os
from json import JSONDecodeError


def parse_with_json(text: str) -> str:
    """
    This funtion is used to handle special characters that cause parsing issues. format.

    """

    # if the text is a string that contains a dictionary
    try:
        text_dictionary = ast.literal_eval(text)

        for key, value in text_dictionary.items():
            key = json.loads(f'"{key}"')
            value = json.loads(f'"{value}"')

        return json.dumps(text_dictionary, ensure_ascii=False)

    except SyntaxError:
        pass

    # if the text is a string
    try:
        return json.loads(f'"{text}"')
    except JSONDecodeError:
        return text


def create_product_csv() -> None:
    # Input file path
    input_file = "data/production_data.csv"

    # Output file path
    output_file = "data/product.csv"

    # Create and write to the product.csv file
    with open(input_file, "r", encoding="utf-8") as infile, open(
        output_file,
        "w",
        newline="",
        encoding="utf-8",
    ) as outfile:
        reader = csv.DictReader(infile)
        writer = csv.writer(outfile)

        # Write headers
        writer.writerow(
            [
                "id",
                "name",
                "category",
                "price",
                "brand",
                "description",
                "specifications",
            ],
        )

        # Process each row
        for row in reader:
            product_id = row["id"]
            name = row["name"]
            category = row["category"]
            price = row["price"]
            brand = row["brand"]
            specifications = row["specifications"]
            description = row["description"]

            # handle special characters in name
            name = parse_with_json(name)
            description = parse_with_json(description)
            specifications = parse_with_json(specifications)

            # Write to product.csv
            writer.writerow(
                [
                    product_id,
                    name,
                    category,
                    price,
                    brand,
                    description,
                    specifications,
                ],
            )


def create_reviews_csv() -> None:
    """
    Processes the input file to extract reviews and writes them to a reviews.csv file.
    """
    # Input file path
    input_file = "data/production_data.csv"

    # Output file path
    output_file = "data/review.csv"

    # Create and write to the review.csv file
    with open(input_file, "r", encoding="utf-8") as infile, open(
        output_file,
        "w",
        newline="",
        encoding="utf-8",
    ) as outfile:
        reader = csv.DictReader(infile)
        writer = csv.writer(outfile)

        # Write headers
        writer.writerow(
            ["id", "product_id", "user_name", "rating", "review_text", "created_at"],
        )

        # Initialize review ID counter
        review_id = 1

        # Process each row
        for row in reader:
            reviews = json.loads(row["reviews"])

            product_id = row["id"]  # Product ID from the input file

            for review in reviews:
                user_name = review.get("users_name")

                rating = review.get("rating")
                review_text = (review.get("review_text")).replace("’", "'")

                created_at = "2023-10-01"

                # Write to reviews.csv
                writer.writerow(
                    [review_id, product_id, user_name, rating, review_text, created_at],
                )

                # Increment review ID
                review_id += 1


def create_variants_csv() -> None:
    """
    Processes the input file to extract variants and writes them to a variants.csv file.
    """
    # Input file path
    input_file = "data/production_data.csv"

    # Output file path
    output_file = "data/variants.csv"

    # Create and write to the review.csv file
    with open(input_file, "r", encoding="utf-8") as infile, open(
        output_file,
        "w",
        newline="",
        encoding="utf-8",
    ) as outfile:
        reader = csv.DictReader(infile)
        writer = csv.writer(outfile)

        # Write headers
        writer.writerow(["id", "product_id", "price", "in_stock"])

        # Initialize review ID counter
        variant_id = 1

        # Process each row
        for row in reader:

            product_id = row["id"]  # Product ID from the input file
            product_data = json.loads(row["Product data Json with variants info"])
            variants = product_data["variants"]

            for variant in variants:
                in_stock = variant["stock"]
                price = product_data["price"]

                # Write to variants.csv
                writer.writerow([variant_id, product_id, price, in_stock])

                # Increment variant ID
                variant_id += 1


def create_variant_attributes_csv():
    """
    Processes the input file to extract variants and writes them to a variants.csv file.
    """
    # Input file path
    input_file = "data/production_data.csv"

    # Output file path
    output_file = "data/variant_attributes.csv"

    # Create and write to the review.csv file
    with open(input_file, "r", encoding="utf-8") as infile, open(
        output_file,
        "w",
        newline="",
        encoding="utf-8",
    ) as outfile:
        reader = csv.DictReader(infile)
        writer = csv.writer(outfile)

        # Write headers
        writer.writerow(
            ["id", "product_id", "variant_id", "attribute_name", "attribute_value"],
        )

        # Initialize review ID counter
        variant_id = 1
        id = 1

        # Process each row
        for row in reader:

            product_id = row["id"]  # Product ID from the input file
            product_data = json.loads(row["Product data Json with variants info"])

            variants = product_data["variants"]

            for variant in variants:
                for key, value in variant.items():

                    if key == "stock" or key == "price":
                        continue

                    attribute_name = key
                    attribute_value = value

                    writer.writerow(
                        [id, product_id, variant_id, attribute_name, attribute_value],
                    )
                    id += 1
                # Increment variant ID
                variant_id += 1


def create_product_images_csv():
    """
    Reads images from the 'images' folder and writes their details to a product_image.csv file.
    The file contains columns: id, product_id, image_url.
    """
    # Input folder path
    images_folder = "data/images"

    # Output file path
    output_file = "data/product_image.csv"

    # Create and write to the product_image.csv file
    with open(output_file, "w", newline="", encoding="utf-8") as outfile:
        writer = csv.writer(outfile)

        # Write headers
        writer.writerow(["id", "product_id", "image_url"])

        # Initialize image ID counter
        image_id = 1

        # Process each image in the folder
        for image_name in os.listdir(images_folder):
            # Skip non-image files
            if not image_name.lower().endswith((".png")):
                continue

            # Extract product ID from the image name
            if "-" in image_name:
                product_id = image_name.split("-image-")[0]
                if check_in_product(product_id) is False:
                    continue
                image_url = f"data/images/{image_name}"

                # Write to product_image.csv
                writer.writerow([image_id, product_id, image_url])

                # Increment image ID
                image_id += 1


def check_in_product(product_id: str) -> bool:
    """
    Check if the product_id exists in the product.csv file.
    """
    product_file = "data/product.csv"

    with open(product_file, "r", encoding="utf-8") as infile:
        reader = csv.DictReader(infile)
        for row in reader:
            if row["id"] == product_id:
                return True
    return False


if __name__ == "__main__":
    create_product_csv()
    create_reviews_csv()
    create_variants_csv()
    create_variant_attributes_csv()
    create_product_images_csv()
