import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Settings as SettingsIcon, 
  Store, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Mail,
  Phone,
  MapPin,
  Save
} from "lucide-react"

const Settings = () => {
  return (
    <div className="space-y-6 p-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">الإعدادات</h1>
        <Button className="bg-gradient-primary">
          <Save className="h-4 w-4 ml-2" />
          حفظ التغييرات
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Store Information */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              معلومات المتجر
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-right">اسم المتجر</label>
              <input
                type="text"
                defaultValue="متجر قطر الإلكتروني"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-right"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-right">وصف المتجر</label>
              <textarea
                rows={3}
                defaultValue="أفضل متجر إلكتروني في قطر لجميع احتياجاتكم"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-right resize-none"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2 text-right">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="email"
                    defaultValue="info@qatarstore.com"
                    className="w-full pr-10 pl-3 py-2 border border-border rounded-lg bg-background text-foreground text-right"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-right">رقم الهاتف</label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="tel"
                    defaultValue="+974 4444 5555"
                    className="w-full pr-10 pl-3 py-2 border border-border rounded-lg bg-background text-foreground text-right"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-right">العنوان</label>
              <div className="relative">
                <MapPin className="absolute right-3 top-3 text-muted-foreground h-4 w-4" />
                <textarea
                  rows={2}
                  defaultValue="الدوحة، دولة قطر"
                  className="w-full pr-10 pl-3 py-2 border border-border rounded-lg bg-background text-foreground text-right resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              إعدادات التنبيهات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="text-right flex-1">
                <div className="font-medium">تنبيهات الطلبات الجديدة</div>
                <div className="text-sm text-muted-foreground">احصل على إشعار عند وصول طلب جديد</div>
              </div>
              <div className="w-10 h-6 bg-primary rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="text-right flex-1">
                <div className="font-medium">تنبيهات المخزون المنخفض</div>
                <div className="text-sm text-muted-foreground">تحذير عندما ينخفض المخزون عن الحد الأدنى</div>
              </div>
              <div className="w-10 h-6 bg-primary rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="text-right flex-1">
                <div className="font-medium">تقارير المبيعات اليومية</div>
                <div className="text-sm text-muted-foreground">تقرير يومي عن أداء المبيعات</div>
              </div>
              <div className="w-10 h-6 bg-border rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              الأمان والخصوصية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-right">كلمة المرور الحالية</label>
              <input
                type="password"
                placeholder="أدخل كلمة المرور الحالية"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-right"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-right">كلمة المرور الجديدة</label>
              <input
                type="password"
                placeholder="أدخل كلمة المرور الجديدة"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-right"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-right">تأكيد كلمة المرور</label>
              <input
                type="password"
                placeholder="أعد إدخال كلمة المرور الجديدة"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-right"
              />
            </div>
            <Button variant="outline" className="w-full">
              تحديث كلمة المرور
            </Button>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              المظهر والعرض
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-right">لغة النظام</label>
              <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-right">
                <option value="ar">العربية</option>
                <option value="en">الإنجليزية</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-right">المنطقة الزمنية</label>
              <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-right">
                <option value="asia/qatar">آسيا/الدوحة</option>
                <option value="asia/riyadh">آسيا/الرياض</option>
                <option value="asia/dubai">آسيا/دبي</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-right">العملة الافتراضية</label>
              <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-right">
                <option value="qar">ريال قطري (ر.ق)</option>
                <option value="usd">دولار أمريكي ($)</option>
                <option value="eur">يورو (€)</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <Button variant="outline">
          إلغاء التغييرات
        </Button>
        <Button className="bg-gradient-primary">
          <Save className="h-4 w-4 ml-2" />
          حفظ جميع التغييرات
        </Button>
      </div>
    </div>
  )
}

export default Settings