import { StatsCard } from "@/components/StatsCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Eye
} from "lucide-react"

const Dashboard = () => {
  const stats = [
    {
      title: "Ventes totales",
      value: "124 500 €",
      change: "+12% par rapport au mois dernier",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "30 derniers jours"
    },
    {
      title: "Nouvelles commandes", 
      value: "245",
      change: "+8% par rapport à la semaine dernière",
      changeType: "positive" as const,
      icon: ShoppingCart,
      description: "Cette semaine"
    },
    {
      title: "Produits disponibles",
      value: "1 248",
      change: "-3 produits en rupture",
      changeType: "negative" as const,
      icon: Package,
      description: "En stock"
    },
    {
      title: "Clients actifs",
      value: "892",
      change: "+15 nouveaux clients",
      changeType: "positive" as const,
      icon: Users,
      description: "Ce mois-ci"
    }
  ]

  const recentOrders = [
    { id: "#12845", customer: "Jean Dupont", amount: "450 €", status: "Terminé", date: "2024-01-15" },
    { id: "#12844", customer: "Marie Martin", amount: "320 €", status: "En préparation", date: "2024-01-15" },
    { id: "#12843", customer: "Pierre Durand", amount: "780 €", status: "Expédié", date: "2024-01-14" },
    { id: "#12842", customer: "Sophie Bernard", amount: "290 €", status: "Terminé", date: "2024-01-14" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Terminé": return "bg-success-light text-success"
      case "En préparation": return "bg-warning-light text-warning"
      case "Expédié": return "bg-primary-light text-primary"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
        <div className="text-sm text-muted-foreground">
          Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart Placeholder */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Revenus des ventes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-subtle rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                <p>Graphique des revenus à venir prochainement</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Commandes récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{order.id}</div>
                    <div className="text-sm text-muted-foreground">{order.customer}</div>
                  </div>
                  <div className="text-center mx-4">
                    <div className="font-bold text-primary">{order.amount}</div>
                    <div className="text-xs text-muted-foreground">{order.date}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <button className="p-4 bg-gradient-primary text-primary-foreground rounded-lg hover:shadow-medium transition-smooth">
              <Package className="h-6 w-6 mb-2" />
              <div className="font-medium">Ajouter un produit</div>
              <div className="text-xs opacity-90">Ajouter un nouveau produit au magasin</div>
            </button>
            <button className="p-4 bg-gradient-gold text-accent-gold-foreground rounded-lg hover:shadow-gold transition-smooth">
              <Eye className="h-6 w-6 mb-2" />
              <div className="font-medium">Vérifier les commandes</div>
              <div className="text-xs opacity-90">Consulter les nouvelles commandes</div>
            </button>
            <button className="p-4 bg-success text-success-foreground rounded-lg hover:shadow-medium transition-smooth">
              <TrendingUp className="h-6 w-6 mb-2" />
              <div className="font-medium">Rapport de ventes</div>
              <div className="text-xs opacity-90">Voir les statistiques de ventes</div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard