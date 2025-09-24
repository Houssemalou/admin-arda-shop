import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Search, Edit, Trash2, Package, Loader2, AlertCircle } from "lucide-react"

import { CategoryReqDTO, CategoryResDTO, ProductDTO } from "../models/types"

const Categories = () => {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isProductsDialogOpen, setIsProductsDialogOpen] = useState(false)
  const [selectedCategoryProducts, setSelectedCategoryProducts] = useState<ProductDTO[]>([])
  const [selectedCategoryName, setSelectedCategoryName] = useState("")
  const [editingCategory, setEditingCategory] = useState<CategoryResDTO | null>(null)
  const [formData, setFormData] = useState<CategoryReqDTO>({
    name: "",
    description: "",
  })

  
  const { data: categories, isLoading, isError } = useQuery<CategoryResDTO[], Error>({
    queryKey: ["categories"],
    queryFn: getCategories,
  })

  const createMutation = useMutation<CategoryResDTO, Error, CategoryReqDTO>({
  mutationFn: (category: CategoryReqDTO) => createCategory(category),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    setIsAddDialogOpen(false);
    resetForm();
  },
});


  const updateMutation = useMutation({
    mutationFn: ({ id, category }: { id: number; category: CategoryReqDTO }) =>
      updateCategory(id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      setIsEditDialogOpen(false)
      setEditingCategory(null)
      resetForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })

  const handleAddCategory = () => {
    createMutation.mutate(formData)
  }

  const handleEditCategory = () => {
    if (editingCategory) {
      updateMutation.mutate({
        id: editingCategory.id,
        category: formData,
      })
    }
  }

  const handleDeleteCategory = (id: number) => {
    deleteMutation.mutate(id)
  }

  const openEditDialog = (category: CategoryResDTO) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    })
  }

  const showCategoryProducts = (categoryName: string) => {
    const category = categories?.find((c) => c.name === categoryName)

    if (category && category.products) {
      setSelectedCategoryProducts(category.products)
    } else {
      setSelectedCategoryProducts([])
    }

    setSelectedCategoryName(categoryName)
    setIsProductsDialogOpen(true)
  }

  return (
    <div className="space-y-6 p-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Gestion des Catégories</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:shadow-medium transition-smooth">
              <Plus className="h-4 w-4 ml-2" />
              Ajouter une catégorie
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]" dir="ltr">
            <DialogHeader>
              <DialogTitle>Ajouter une catégorie</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de la catégorie</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-right"
                  placeholder="مثال: الإلكترونيات"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="text-right"
                  placeholder="وصف مختصر للفئة..."
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddCategory} disabled={createMutation.isPending} className="flex-1">
                {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "إضافة"}
              </Button>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                إلغاء
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher dans les catégories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground text-left"
            />
          </div>
        </CardContent>
      </Card>

      {/* Loader & Error */}
      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      {isError && (
        <div className="flex items-center gap-2 text-destructive py-6 justify-center">
          <AlertCircle className="h-5 w-5" />
          <span>حدث خطأ أثناء تحميل الفئات</span>
        </div>
      )}

      {/* Categories Grid */}
      {!isLoading && !isError && categories && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories
            .filter((cat: CategoryResDTO) => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((category: CategoryResDTO) => (
              <Card key={category.id} className="shadow-medium hover:shadow-strong transition-smooth">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => openEditDialog(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir="rtl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                            <AlertDialogDescription>هل أنت متأكد من حذف الفئة "{category.name}"؟</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteCategory(category.id)} className="bg-destructive hover:bg-destructive/90">
                              {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "حذف"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="text-right">
                    <h3 className="font-bold text-lg text-foreground mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>

                  <div className="pt-2">
                    <Button variant="outline" className="w-full" onClick={() => showCategoryProducts(category.name)}>
                      <Package className="h-4 w-4 ml-2" />
                      عرض المنتجات
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]" dir="ltr">
          <DialogHeader>
            <DialogTitle>Modifier la catégorie</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">اسم الفئة</Label>
              <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="text-right" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">الوصف</Label>
              <Textarea id="edit-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="text-right" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleEditCategory} disabled={updateMutation.isPending} className="flex-1">
              {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "حفظ التغييرات"}
            </Button>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
              إلغاء
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Products Dialog */}
      <Dialog open={isProductsDialogOpen} onOpenChange={setIsProductsDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh]" dir="ltr">
          <DialogHeader>
            <DialogTitle>Produits de la catégorie : {selectedCategoryName}</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto">
            {selectedCategoryProducts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">اسم المنتج</TableHead>
                    <TableHead className="text-right">السعر</TableHead>
                    <TableHead className="text-right">المخزون</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedCategoryProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium text-right">{product.name}</TableCell>
                      <TableCell className="text-right font-bold text-primary">{product.price}</TableCell>
                      <TableCell className="text-right">{product.stock}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">لا توجد منتجات في هذه الفئة</div>
            )}
          </div>
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setIsProductsDialogOpen(false)}>
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Categories
