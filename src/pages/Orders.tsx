import { useRef, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { jsPDF } from "jspdf";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { 
  Eye,
  MapPin,
  Package,
  Phone,
  Receipt,
  Shield,
  User
} from "lucide-react"
import html2canvas from "html2canvas";
import { getOrders, updateStatus } from "../services/orderService";
import { OrderDTO, StatusRequest } from "../models/types";
interface PageableResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
}
const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderDTO | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
const [currentPage, setCurrentPage] = useState(0);
const [pageSize, setPageSize] = useState(10);
  const queryClient = useQueryClient();
const pdfRef = useRef();
const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};
const statusLabels: Record<string, string> = {
  PENDING: "في الانتظار",
  confirmed: "مؤكد ",
  shipped: "تم الشحن",
  delivered: "تم التوصيل",
  CANCELLED: "أُلغي",
};

const downloadPDF = () => {
  if (!pdfRef.current) return;

  // optionnel: scroll en haut pour capturer correctement
  window.scrollTo(0, 0);

  html2canvas(pdfRef.current, {
    scale: 2,        // meilleure résolution
    useCORS: true,   // pour les images externes
    logging: false,
  }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210; // largeur A4
    const pageHeight = 297; // hauteur A4
    const margin = 10;

    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

     let heightLeft = imgHeight - (pageHeight - margin * 2);
    let position = margin;

    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - margin * 2;

    while (heightLeft > 0) {
      pdf.addPage();
      position = margin;
      pdf.addImage(
        imgData,
        "PNG",
        margin,
        position,
        imgWidth,
        Math.min(imgHeight, pageHeight - margin * 2)
      );
      heightLeft -= pageHeight - margin * 2;
    }

    pdf.save(`facture-${selectedOrder?.orderId}.pdf`);
  });
};


 
const { data: ordersData, isLoading } = useQuery<PageableResponse<OrderDTO>, Error>({
  queryKey: ["orders", currentPage, pageSize],
  queryFn: () => getOrders(currentPage, pageSize),
});

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => {
      const req: StatusRequest = { status };
      return updateStatus(id, req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const openOrderDetails = (order: OrderDTO) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
    console.log(order);
  };

const filteredOrders = (ordersData?.content || []).filter(order => {
  const statusMatch =
    selectedStatus === "all" ||
    order.status?.toLowerCase() === selectedStatus.toLowerCase();

  const search = searchTerm.trim().toLowerCase();
  const searchMatch =
    !search ||
    order.orderId.toLowerCase().includes(search) ||
    (order.customerInfo?.name?.toLowerCase().includes(search) || false);

  return statusMatch && searchMatch;
});


  return (
    <div className="space-y-6 p-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">إدارة الطلبات</h1>
<div className="text-sm text-muted-foreground">
  إجمالي الطلبات: {ordersData ? ordersData.totalElements : 0}
</div>

      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="البحث برقم الطلب أو اسم العميل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 text-right"
            />
          </div>
          <div className="flex gap-2">
            {["all", "pending", "confirmed", "shipped", "delivered"].map(status => (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(status)}
              >
                {status === "all" && "الكل"}
                {status === "pending" && "في الانتظار"}
                {status === "confirmed" && "مؤكد"}
                {status === "shipped" && "تم الشحن"}
                {status === "delivered" && "تم التسليم"}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                لا توجد طلبات
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedStatus !== "all" 
                  ? "لم يتم العثور على طلبات تطابق معايير البحث" 
                  : "لا توجد طلبات حالياً"}
              </p>
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">رقم الطلب</TableHead>
                <TableHead className="text-right">العميل</TableHead>
                <TableHead className="text-right">التاريخ والوقت</TableHead>
                <TableHead className="text-right">العناصر</TableHead>
                <TableHead className="text-right">المجموع</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map(order => (
              <TableRow key={order.orderId}>
                <TableCell className="font-medium text-right">{order.orderId}</TableCell>
                <TableCell className="text-right">{order.customerInfo?.name || 'غير محدد'}</TableCell>
                <TableCell className="text-right">{order.date} - {order.time}</TableCell>
                <TableCell className="text-right">
                {/* Render product names and quantities as a string */}
                {Array.isArray(order.items)
                  ? order.items.map((item: { productName: string; quantity: number }, idx: number) =>
                    <span key={idx}>
                    {item.productName} × {item.quantity}
                    {idx < (Array.isArray(order.items) ? order.items.length - 1 : 0) ? ", " : ""}
                    </span>
                  )
                  : (typeof order.items === "number" ? `${order.items} عناصر` : order.items)
                }
                </TableCell>
                <TableCell className="text-right font-bold text-primary">{order.total}</TableCell>
                <TableCell className="text-right">
                <Select
                  value={order.status}
                  onValueChange={(value) => statusMutation.mutate({ id: order.orderId, status: value })}
                >
                  <SelectTrigger className="w-32">
                  <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                  <SelectItem value="PENDING">في الانتظار</SelectItem>
                  <SelectItem value="confirmed">مؤكد</SelectItem>
                  <SelectItem value="shipped">تم الشحن</SelectItem>
                  <SelectItem value="delivered">تم التسليم</SelectItem>
                  </SelectContent>
                </Select>
                </TableCell>
                <TableCell className="text-right">
                <Button size="sm" variant="outline" onClick={() => openOrderDetails(order)}>
                  <Eye className="h-4 w-4" />
                </Button>
                </TableCell>
              </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
          {filteredOrders.length > 0 && (
          <div className="flex justify-center items-center space-x-3 mt-6 rtl:space-x-reverse">
            {/* Bouton précédent */}
            <Button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((old) => Math.max(old - 1, 0))}
              className={`px-4 py-2 rounded-lg transition ${
                currentPage === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              السابق
            </Button>

            {/* Indicateur de page */}
            <div className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium">
              الصفحة {currentPage + 1} من {ordersData?.totalPages || 1}
            </div>

            {/* Bouton suivant */}
            <Button
              disabled={currentPage + 1 >= (ordersData?.totalPages || 1)}
              onClick={() => setCurrentPage((old) => old + 1)}
              className={`px-4 py-2 rounded-lg transition ${
                currentPage + 1 >= (ordersData?.totalPages || 1)
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              التالي
            </Button>
          </div>
          )}


        </CardContent>
      </Card>


<Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
    <style>
    {`
      .no-print {
        display: block; /* affichage normal à l’écran */
      }

      @media print {
        .no-print {
          display: none !important; /* caché dans le PDF / impression */
        }
      }
    `}
  </style>
  <DialogContent className="sm:max-w-[450px] max-h-[80vh] overflow-y-auto" dir="rtl">
    <DialogHeader>
      <DialogTitle>تفاصيل الطلب #{selectedOrder?.orderId}</DialogTitle>
    </DialogHeader>

    {selectedOrder && (
      <div className="space-y-6 py-4 text-right text-sm" >
        
        {/* معلومات العميل */}
        <div className="space-y-2">
          <h3 className="text-base font-semibold">معلومات العميل</h3>
          <div className="bg-muted/50 p-3 rounded-lg space-y-1">
            <div><span className="font-medium">الاسم:</span> {selectedOrder.customerInfo?.name || 'غير محدد'}</div>
            <div><span className="font-medium">الهاتف:</span> {selectedOrder.customerInfo?.phone || 'غير محدد'}</div>
            <div><span className="font-medium">العنوان:</span> {selectedOrder.customerInfo?.address || 'غير محدد'}</div>
          </div>
        </div>

        {/* المنتجات */}
        <div className="space-y-2">
          <h3 className="text-base font-semibold">المنتجات</h3>
          <div className="space-y-2">
            {Array.isArray(selectedOrder.items) && selectedOrder.items.map((product, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <div className="font-medium">{product.productName}</div>
                  <div className="text-xs text-muted-foreground">الكمية: {product.quantity}</div>
                </div>
                <div className="font-bold">{product.price} ر.ق</div>
              </div>
            ))}
          </div>
        </div>

        {/* ملخص الطلب */}
        <div className="space-y-2">
          <h3 className="text-base font-semibold">ملخص الطلب</h3>
          <div className="bg-muted/50 p-3 rounded-lg space-y-1">
            <div className="flex justify-between">
              <span>المجموع الفرعي:</span>
              <span>{selectedOrder.total} ر.ق</span>
            </div>
            <div className="flex justify-between">
              <span>الشحن:</span>
              <span>0  ر.ق</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>المجموع الإجمالي:</span>
              <span>{selectedOrder.total} ر.ق</span>
            </div>
          </div>
        </div>

        {/* حالة الطلب */}
  <div
  className={`p-2 rounded text-center font-medium ${
    statusColors[selectedOrder.status] || "bg-gray-100 text-gray-700"
  }`}
>
  {statusLabels[selectedOrder.status] || selectedOrder.status}
</div>

      </div>
    )}

    {/* Bouton téléchargement */}
    <div className="flex justify-center mt-4">
      <button
        onClick={downloadPDF}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded flex items-center"
      >
        <svg
          className="w-5 h-5 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          ></path>
        </svg>
        تحميل PDF
      </button>
    </div>
    
  </DialogContent>
<style>{`
  /* Toujours visible à l'écran */
  .pdf-section {
    display: block;
  }

  /* Mais masqué à l'impression si besoin */
  @media print {
    .no-print {
      display: none !important;
    }
  }
`}</style>

<div
  ref={pdfRef}
  className="pdf-section"
  style={{
    position: "absolute",
    left: "-9999px", // déplace hors écran
    top: "0",
    width: "210mm",
    padding: "15mm",
    fontFamily: "Arial, sans-serif",
    direction: "rtl",
  }}
>
  {/* En-tête avec logo stylisé */}
{/* En-tête avec logo stylisé */}
<div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
  <div className="mb-4">
    <h1 className="text-3xl font-bold text-gray-900 mb-2 ">
      ARDA STORE
    </h1>
    <h2 className="text-2xl font-bold text-gray-700 mb-2">
      فاتورة
    </h2>
    <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-3"></div>
  </div>
  <div className="flex items-center justify-center text-gray-600 text-sm">
    <i className="bi bi-geo-alt-fill ml-2"></i>
    <span>قطر، الدوحة</span>
  </div>
</div>


  {/* Informations Client */}
  {selectedOrder && (
    <div className="mb-8">
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center mb-3 pb-2 border-b border-gray-300">
          <i className="bi bi-person-fill text-blue-600 ml-2"></i>
          <h3 className="text-lg font-bold text-gray-900">معلومات العميل</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600 font-medium">الاسم:</span>
            <span className="font-semibold text-gray-900">
              {selectedOrder.customerInfo?.name || 'غير محدد'}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center">
              <i className="bi bi-telephone-fill text-gray-500 ml-2"></i>
              <span className="text-gray-600 font-medium">الهاتف:</span>
            </div>
            <span className="font-semibold text-gray-900 font-mono">
              {selectedOrder.customerInfo?.phone || 'غير محدد'}
            </span>
          </div>
              <div className="flex justify-between items-center py-2">
            <div className="flex items-center">
              <i className="bi bi-telephone-fill text-gray-500 ml-2"></i>
              <span className="text-gray-600 font-medium">العنوان:</span>
            </div>
            <span className="font-semibold text-gray-900 font-mono">
              {selectedOrder.customerInfo?.address || "لا يوجد عنوان"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )}

  {/* Produits */}
  {selectedOrder && (
    <div className="mb-8">
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center mb-4 p-4 pb-2 border-b border-gray-300">
          <i className="bi bi-box-seam text-green-600 ml-2"></i>
          <h3 className="text-lg font-bold text-gray-900">المنتجات</h3>
        </div>
        <div className="px-4 pb-4">
          <div className="space-y-2">
            {selectedOrder.items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex-1">
                  <span className="font-medium text-gray-900">
                    {item.productName}
                  </span>
                </div>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium">
                    x {item.quantity}
                  </span>
                  <span className="font-bold text-blue-600 font-mono">
                    {item.price} ر.ق
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )}

  {/* Résumé de la commande */}
  {selectedOrder && (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center mb-4 pb-2 border-b border-gray-300">
          <i className="bi bi-receipt text-purple-600 ml-2"></i>
          <h3 className="text-lg font-bold text-gray-900">ملخص الطلب</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600 font-medium">المجموع الفرعي:</span>
            <span className="font-semibold text-gray-900 font-mono">
              {selectedOrder.total} ر.ق
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600 font-medium">الشحن:</span>
            <span className="font-semibold text-green-600 font-mono">
              مجاني
            </span>
          </div>
          <div className="border-t border-gray-300 pt-3">
            <div className="flex justify-between items-center py-2 bg-white rounded-md px-3 shadow-sm">
              <span className="text-lg font-bold text-gray-900">
                المجموع الإجمالي:
              </span>
              <span className="text-xl font-bold text-blue-600 font-mono">
                {selectedOrder.total} ر.ق
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}

  {/* Footer / Garantie */}
  <div className="text-center border-t-2 border-gray-300 pt-6">
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center justify-center mb-2">
        <i className="bi bi-shield-fill text-green-600 ml-2"></i>
        <h3 className="text-lg font-bold text-green-800">ضمان لمدة سنة واحدة</h3>
      </div>
      <p className="text-sm text-green-700">
        نحن نضمن جودة منتجاتنا وخدماتنا لمدة عام كامل
      </p>
    </div>

    <div className="mt-4 pt-4 border-t border-gray-200">
      <p className="text-xs text-gray-500">
        شكراً لثقتكم في متجر أردا • ARDA STORE
      </p>
    </div>
  </div>
</div>

</Dialog>
{/* Section PDF cachée */}


{/* Section PDF complète, cachée à l'écran */}

    </div>
  );
};

export default Orders;