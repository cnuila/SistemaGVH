import os
import csv
import pyodbc

script_dir = os.path.dirname(os.path.abspath(__file__))

def insert_delivery_zone_if_not_exists(zone_name, conn):
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM deliveryzones_api_deliveryzones WHERE name = ?", zone_name)
    count = cursor.fetchone()[0]
    #print("zona: ", zone_name, " count: ", count)
    if count == 0:
        #print("insertando zona: ", zone_name)
        cursor.execute("INSERT INTO deliveryzones_api_deliveryzones (name) VALUES (?)", zone_name)
        conn.commit()

def insert_provider_if_not_exists(provider_name, conn):
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM providers_api_providers WHERE name = ?", provider_name)
    count = cursor.fetchone()[0]
    if count == 0:
        cursor.execute("INSERT INTO providers_api_providers (name) VALUES (?)", provider_name)
        conn.commit()


def import_delivery_locations_from_csv(csv_file_path, conn):
    csv_file = os.path.join(script_dir, csv_file_path)
    with open(csv_file, newline='') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)  # Skip the header row
        for row in reader:
            location_name, location_address, delivery_zone_name = row
            insert_delivery_zone_if_not_exists(delivery_zone_name, conn)
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO deliverylocations_api_deliverylocations (name, address, deliveryZoneId_id) "
                "VALUES ( ?, ?, (SELECT id FROM deliveryzones_api_deliveryzones WHERE name = ?))",
                location_name, location_address, delivery_zone_name
            )
            conn.commit()

def import_products_from_csv(csv_file_path, conn):
    csv_file = os.path.join(script_dir, csv_file_path)

    with open(csv_file, newline='') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)  # Skip the header row
        for row in reader:
            code, name, provider_name = row
            insert_provider_if_not_exists(provider_name, conn)
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO products_api_product (code, description, cost, sellingPrice, quantity, providerId_id) "
                "VALUES (?, ?, ?, ?, ?, (SELECT id FROM providers_api_providers WHERE name = ?))",
                code, name, 0, 0, 0, provider_name
            )
            conn.commit()

if __name__ == "__main__":
    delivery_locations_csv = "deliveryLocations.csv"
    products_csv = "products.csv"

    # Database connection parameters
    # conn = pyodbc.connect(
    #     "Driver={ODBC Driver 18 for SQL Server};"
    #     "Server=msi-josue\\sqlexpress;"
    #     "Database=GVHDb;"
    #     "UID=josue;"
    #     "PWD=33441221;"
    #     "Encrypt=no;"
    #     "TrustServerCertificate=yes;"
    # )
    
    conn = pyodbc.connect(
        "Driver={ODBC Driver 18 for SQL Server};"
        "Server=localhost;"
        "Database=GVHDb;"
        "UID=sa;"
        "PWD=Password#123;"
        "Encrypt=no;"
        "TrustServerCertificate=yes;"
    )
    
    import_delivery_locations_from_csv(delivery_locations_csv, conn)
    import_products_from_csv(products_csv, conn)

    # Close the database connection
    conn.close()
