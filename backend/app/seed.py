"""
Seed script to populate the database with initial product data.
Run with: python -m app.seed
"""

from app.database import SessionLocal, init_db
from app.models import Product

SEED_PRODUCTS = [
    {
        "slug": "smart-trend-indicator",
        "title": "Smart Trend Indicator",
        "description_short": "Indikator yang membantu mengidentifikasi tren pasar dengan mudah. Cocok untuk pemula yang baru belajar analisis teknikal.",
        "description_full": """Smart Trend Indicator adalah indikator trading yang dirancang khusus untuk pemula. Dengan tampilan visual yang sederhana, Anda dapat dengan mudah mengidentifikasi arah tren pasar.

Fitur utama:
- Deteksi tren otomatis (bullish/bearish)
- Sinyal entry dan exit yang jelas
- Kompatibel dengan MT4 dan MT5
- Alert notifikasi ke HP

Cocok untuk semua pair forex dan timeframe.""",
        "price_idr": 299000,
        "category": "indikator",
        "badges": ["popular"],
        "images": [
            "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=60"
        ],
        "is_active": True,
    },
    {
        "slug": "auto-scalper-ea",
        "title": "Auto Scalper EA",
        "description_short": "Robot trading otomatis untuk strategi scalping. Dilengkapi dengan manajemen risiko bawaan dan mudah dikonfigurasi.",
        "description_full": """Auto Scalper EA adalah robot trading (Expert Advisor) yang menggunakan strategi scalping otomatis. Robot ini didesain untuk mengambil profit kecil namun konsisten dari pergerakan harga.

Fitur utama:
- Trading otomatis 24/5
- Manajemen risiko built-in (stop loss, take profit)
- Parameter yang mudah dikonfigurasi
- Cocok untuk akun kecil (mulai $100)

Disclaimer: Robot ini TIDAK menjamin profit. Trading mengandung risiko.""",
        "price_idr": 499000,
        "category": "robot",
        "badges": ["new"],
        "images": [
            "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&auto=format&fit=crop&q=60"
        ],
        "is_active": True,
    },
    {
        "slug": "panduan-trading-pemula",
        "title": "Panduan Trading Pemula",
        "description_short": "Ebook lengkap untuk memulai trading dari nol. Bahasa sederhana, banyak ilustrasi, dan contoh praktis.",
        "description_full": """Ebook Panduan Trading Pemula adalah panduan lengkap untuk Anda yang baru ingin memulai trading. Ditulis dengan bahasa yang sederhana dan dilengkapi banyak ilustrasi.

Isi ebook:
- Pengenalan pasar forex
- Cara membaca chart
- Analisis teknikal dasar
- Manajemen risiko
- Psikologi trading
- Strategi trading sederhana

Format: PDF (150+ halaman)
Bonus: Video tutorial instalasi MT4/MT5""",
        "price_idr": 99000,
        "category": "ebook",
        "badges": ["bestseller"],
        "images": [
            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=60"
        ],
        "is_active": True,
    },
    {
        "slug": "fxsociety-tshirt",
        "title": "FXSociety T-Shirt",
        "description_short": "Kaos premium dengan desain eksklusif fxsociety. Bahan cotton combed 30s yang nyaman dipakai.",
        "description_full": """Kaos premium fxsociety dengan desain eksklusif.

Spesifikasi:
- Bahan: Cotton Combed 30s
- Sablon: DTF Premium (tahan lama)
- Ukuran: S, M, L, XL, XXL
- Warna: Hitam

Perawatan:
- Cuci dengan air dingin
- Jangan gunakan pemutih
- Setrika suhu rendah""",
        "price_idr": 150000,
        "category": "merchandise",
        "badges": [],
        "images": [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60"
        ],
        "is_active": True,
    },
    {
        "slug": "support-resistance-pro",
        "title": "Support & Resistance Pro",
        "description_short": "Indikator otomatis yang menggambar level support dan resistance penting. Hemat waktu analisis Anda.",
        "description_full": """Support & Resistance Pro secara otomatis mengidentifikasi dan menggambar level-level penting pada chart Anda.

Fitur:
- Deteksi level otomatis
- Multi-timeframe analysis
- Alert saat harga mendekati level
- Kompatibel MT4/MT5

Tidak perlu lagi menggambar manual!""",
        "price_idr": 349000,
        "category": "indikator",
        "badges": [],
        "images": [
            "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&auto=format&fit=crop&q=60"
        ],
        "is_active": True,
    },
    {
        "slug": "grid-trading-bot",
        "title": "Grid Trading Bot",
        "description_short": "Robot EA dengan strategi grid trading. Cocok untuk pasar sideways dan mudah diatur parameternya.",
        "description_full": """Grid Trading Bot menggunakan strategi grid yang efektif untuk kondisi pasar sideways.

Fitur:
- Strategi grid otomatis
- Parameter grid yang fleksibel
- Manajemen risiko terintegrasi
- Monitoring via Telegram

Cocok untuk: EUR/USD, AUD/USD di market sideways.

Disclaimer: Tidak ada jaminan profit. Gunakan dengan bijak.""",
        "price_idr": 599000,
        "category": "robot",
        "badges": [],
        "images": [
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"
        ],
        "is_active": True,
    },
    {
        "slug": "psikologi-trading",
        "title": "Psikologi Trading",
        "description_short": "Ebook tentang mentalitas dan psikologi yang dibutuhkan untuk sukses dalam trading. Wajib baca!",
        "description_full": """Ebook Psikologi Trading membahas aspek mental yang sering diabaikan oleh trader pemula.

Topik yang dibahas:
- Mengontrol emosi saat trading
- Mengatasi fear dan greed
- Disiplin dan konsistensi
- Mindset trader profesional
- Recovery dari kerugian

Format: PDF (80+ halaman)""",
        "price_idr": 79000,
        "category": "ebook",
        "badges": [],
        "images": [
            "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=60"
        ],
        "is_active": True,
    },
    {
        "slug": "fxsociety-hoodie",
        "title": "FXSociety Hoodie",
        "description_short": "Hoodie premium dengan desain minimalis. Bahan fleece tebal yang hangat dan stylish.",
        "description_full": """Hoodie premium fxsociety dengan desain minimalis.

Spesifikasi:
- Bahan: Cotton Fleece
- Sablon: DTF Premium
- Ukuran: S, M, L, XL, XXL
- Warna: Hitam
- Kantong depan + tali hoodie

Catatan: Produk ini sedang tidak tersedia.""",
        "price_idr": 250000,
        "category": "merchandise",
        "badges": [],
        "images": [
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=60"
        ],
        "is_active": False,  # Sold out / inactive
    },
]


def seed_products():
    """Seed products into the database."""
    init_db()
    db = SessionLocal()

    try:
        # Check if products already exist
        existing = db.query(Product).count()
        if existing > 0:
            print(f"Database already has {existing} products. Skipping seed.")
            return

        # Insert products
        for product_data in SEED_PRODUCTS:
            product = Product(**product_data)
            db.add(product)

        db.commit()
        print(f"Successfully seeded {len(SEED_PRODUCTS)} products.")

    except Exception as e:
        db.rollback()
        print(f"Error seeding products: {e}")
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_products()
