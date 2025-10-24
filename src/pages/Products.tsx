import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter, Edit, Trash2, Tag, Percent } from "lucide-react"
import { ProductDTO } from "../models/types"
import * as productService from "../services/productService"
import { useQuery } from "@tanstack/react-query"
import { getCategories } from "@/services/categoryService"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
const Products = () => {
  const [products, setProducts] = useState<ProductDTO[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductDTO | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description:"",
    category: "",
    price: 0,
    originalPrice: 0,
    stock: 0,
    status: "متوفر",
    discount: 0,
    photo: null as File | null,
    promo: false
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false)
  const [discountType, setDiscountType] = useState<"product" | "category">("product")
  const [discountValue, setDiscountValue] = useState(0)
  const [selectedProductForDiscount, setSelectedProductForDiscount] = useState<ProductDTO | null>(null)

  // Helper function to truncate description to 3 words
  const truncateDescription = (text: string | undefined, maxWords: number = 3): string => {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "...";
  };

  // Helper function to truncate product name to 2 words
  const truncateName = (text: string | undefined, maxWords: number = 2): string => {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "...";
  };

  const fetchCategories = async () => {
  try {
    const data = await getCategories()
    const categoryNames = data.map((cat: { name: string }) => cat.name)
    setCategories(categoryNames)
  } catch (err) {
    console.error("Erreur lors du chargement des catégories", err)
  }
}

  const statuses = ["متوفر", "نفد المخزون", "قريباً", "غير نشط"]

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const data = await productService.getProducts()
      setProducts(data)
    } catch (err) {
      console.error("Erreur lors du chargement des produits", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "متوفر": return "bg-success-light text-success"
      case "نفد المخزون": return "bg-destructive/10 text-destructive"
      case "قريباً": return "bg-warning-light text-warning"
      case "غير نشط": return "bg-muted text-muted-foreground"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description:"",
      category: "",
      price: 0,
      originalPrice: 0,
      stock: 0,
      status: "متوفر",
      discount: 0,
      photo: null,
      promo: false
    })
  }

  const handleAddProduct = async () => {
    setIsLoading(true)
    try {
      // Auto-set promo to true if there's a discount applied
      const hasDiscount = formData.discount && formData.discount > 0;
      
      await productService.createProduct(
        {
          id: 0,
          name: formData.name,
          description: formData.description,
          category: formData.category,
          price: formData.originalPrice, // Map price to originalPrice
          originalPrice: formData.originalPrice,
          stock: formData.stock,
          status: formData.status,
          discount: formData.discount || 0,
          photoPath: "",
          promo: hasDiscount // Auto-set promo if discount is applied
        },
        formData.photo || undefined
      )
      await fetchProducts()
      setIsAddDialogOpen(false)
      resetForm()
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const openEditDialog = (product: ProductDTO) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description:product.description,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stock,
      status: product.status,
      discount: product.discount || 0,
      photo: null,
      promo: false
    })
    setIsEditDialogOpen(true)
  }

  const handleEditProduct = async () => {
    if (!editingProduct) return
    setIsLoading(true)
    try {
      // Auto-set promo to true if there's a discount applied (price != originalPrice)
      const updatedPrice = formData.originalPrice;
      const hasDiscount = formData.discount && formData.discount > 0;
      
      await productService.updateProduct(editingProduct.id, {
        ...editingProduct,
        ...formData,
        price: updatedPrice,
        promo: hasDiscount // Auto-set promo if discount is applied
      })
      await fetchProducts()
      setIsEditDialogOpen(false)
      setEditingProduct(null)
      resetForm()
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProduct = async (id: number) => {
    setIsLoading(true)
    try {
      await productService.deleteProduct(id)
      await fetchProducts()
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const openDiscountDialog = (product?: ProductDTO) => {
    setSelectedProductForDiscount(product)
    setDiscountType(product ? "product" : "category")
    setIsDiscountDialogOpen(true)
  }
const applyDiscount = async () => {
  setIsLoading(true);
  console.log(selectedProductForDiscount)
  try {
    if (discountType =="product" && selectedProductForDiscount) {
      // Remise sur un produit spécifique
      await productService.applyDiscount(selectedProductForDiscount.id, discountValue);
    } else if (discountType == "category") {
      // Si aucune catégorie sélectionnée, utiliser celle du produit sélectionné (optionnel)
      const categoryToApply = selectedProductForDiscount?.category;
      console.log(categoryToApply)
      if (categoryToApply) {
        await productService.applyDiscountToCategory(categoryToApply, discountValue);
      } else {
        console.warn("Aucune catégorie sélectionnée pour appliquer la remise.");
      }
    }

    // Recharger les produits après la remise
    await fetchProducts();

    // Réinitialiser les valeurs
    setIsDiscountDialogOpen(false);
    setDiscountValue(0);
  } catch (err) {
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory


  })
     const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)
  return (
    <div className="space-y-6 p-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">إدارة المنتجات</h1>
        <div className="flex gap-2">
          <Button onClick={() => openDiscountDialog(selectedProductForDiscount)} variant="outline" className="flex items-center gap-2">
            <Percent className="h-4 w-4" />
            إدارة التخفيضات
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:shadow-medium transition-smooth flex items-center gap-2">
                <Plus className="h-4 w-4" />
                إضافة منتج جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] max-h-[90vh]" dir="rtl">
              <DialogHeader>
                <DialogTitle>إضافة منتج جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="name" className="text-sm">اسم المنتج</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="text-right h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="category" className="text-sm">الفئة</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger className="text-right h-8">
                        <SelectValue placeholder="اختر الفئة" />
                      </SelectTrigger>
                        <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>
                          {cat}
                          </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                    <Label htmlFor="price" className="text-sm">السعر</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value)})}
                      className="text-right h-8"
                      placeholder="100 ر.ق"
                    />
                    </div>
                    <div className="space-y-1 flex flex-col justify-end">
                    <Label htmlFor="promo" className="text-sm">عرض ترويجي</Label>
                    <Button
                      type="button"
                      variant={formData.promo ? "default" : "outline"}
                      className="h-8"
                      onClick={() => setFormData({ ...formData, promo: !formData.promo })}
                    >
                      {formData.promo ? "مفعل" : "غير مفعل"}
                    </Button>
                    </div>
                  <div className="space-y-1">
                    <Label htmlFor="stock" className="text-sm">المخزون</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="text-right h-8"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="status" className="text-sm">الحالة</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger className="text-right h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                   <div className="space-y-1">
                    <Label htmlFor="name" className="text-sm"> الوصف</Label>
                    <Input
                      id="name"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="text-right h-8"
                    />
                  </div>
                <div className="space-y-1">
                  <Label htmlFor="photo">صورة المنتج</Label>
                  <Input
                    id="photo"
                    type="file"
                    onChange={(e) => setFormData({ ...formData, photo: e.target.files ? e.target.files[0] : null })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddProduct} className="flex-1">إضافة</Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">إلغاء</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search & Filters */}
      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="البحث في المنتجات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 text-right"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              فلترة
            </Button>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="اختر الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
<Card className="shadow-soft">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">جارٍ التحميل...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">اسم المنتج</TableHead>
                    <TableHead className="text-right">الوصف </TableHead>
                    <TableHead className="text-right">الفئة</TableHead>
                    <TableHead className="text-right">السعر الأصلي</TableHead>
                    <TableHead className="text-right">السعر النهائي</TableHead>
                    <TableHead className="text-right">التخفيض</TableHead>
                    <TableHead className="text-right">العرض المميز</TableHead>
                    <TableHead className="text-right">المخزون</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProducts.map(product => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium text-right" title={product.name}>
                        {truncateName(product.name)}
                      </TableCell>
                      <TableCell className="font-medium text-right" title={product.description}>
                        {truncateDescription(product.description)}
                      </TableCell>
                      <TableCell className="text-right">{product.category}</TableCell>
                      <TableCell className="text-right font-bold">{product.originalPrice} ر.ق</TableCell>
                      <TableCell className="text-right font-bold text-green-600">{product.price} ر.ق</TableCell>
                      <TableCell className="text-right">
                        {product.discount ? <Badge>{product.discount}% خصم</Badge> : "لا يوجد"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant={product.promo ? "default" : "outline"}
                          className="h-8"
                          onClick={async () => {
                            setIsLoading(true)
                            try {
                              await productService.updateProduct(product.id, {
                                ...product,
                                promo: !product.promo
                              })
                              await fetchProducts()
                            } catch (err) {
                              console.error(err)
                            } finally {
                              setIsLoading(false)
                            }
                          }}
                        >
                          {product.promo ? "مفعل" : "غير مفعل"}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">{product.stock}</TableCell>
                      <TableCell className="text-right">{product.status}</TableCell>
                       <TableCell className="text-right flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openDiscountDialog(product)}>
                        <Tag className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir="rtl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                            <AlertDialogDescription>
                              هل أنت متأكد من حذف المنتج "{product.name}"؟ لا يمكن التراجع عن هذا الإجراء.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteProduct(product.id)} className="bg-destructive hover:bg-destructive/90">
                              حذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                          className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            isActive={currentPage === i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                          className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[400px] max-h-[100vh]" dir="rtl">
          <DialogHeader>
            <DialogTitle>تعديل المنتج</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label htmlFor="edit-name">اسم المنتج</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="text-right h-8"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-name"> الوصف</Label>
              <Input
                id="edit-name"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="text-right h-8"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-category">الفئة</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="text-right h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-price">السعر</Label>
              <Input
                id="edit-price"
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value )})}
                className="text-right h-8"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-stock">المخزون</Label>
              <Input
                id="edit-stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="text-right h-8"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-status">الحالة</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="text-right h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-photo">صورة المنتج</Label>
              <Input
                id="edit-photo"
                type="file"
                onChange={(e) => setFormData({ ...formData, photo: e.target.files ? e.target.files[0] : null })}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleEditProduct} className="flex-1" disabled={isLoading}>
              {isLoading ? "جارٍ التحديث..." : "تعديل"}
            </Button>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">إلغاء</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Discount Dialog */}
      <Dialog open={isDiscountDialogOpen} onOpenChange={setIsDiscountDialogOpen}>
        <DialogContent className="sm:max-w-[400px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>تطبيق التخفيض</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label>قيمة التخفيض (%)</Label>
              <Input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="text-right h-8"
              />
            </div>
<div className="space-y-1">
  <Label htmlFor="discountType">نوع التخفيض</Label>
  <Select
    value={discountType}
    onValueChange={(value: "product" | "category") => setDiscountType(value)}
  >
    <SelectTrigger id="discountType" className="h-8">
      <SelectValue placeholder="اختر نوع التخفيض" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="product">منتج محدد</SelectItem>
      <SelectItem value="category">فئة كاملة</SelectItem>
    </SelectContent>
  </Select>
</div>

            {discountType === "product" && selectedProductForDiscount && (
              <div className="text-right font-medium">
                سيتم تطبيق التخفيض على: {selectedProductForDiscount.name}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={applyDiscount} className="flex-1" disabled={isLoading}>
              {isLoading ? "جارٍ التطبيق..." : "تطبيق التخفيض"}
            </Button>
            <Button variant="outline" onClick={() => setIsDiscountDialogOpen(false)} className="flex-1">إلغاء</Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>


  )
}

export default Products
