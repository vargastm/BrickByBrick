const pexelsBuildingIds = [
  323775, // Building
  323780, // Architecture
  323772, // Construction
  323776, // Skyscraper
  323777, // Modern building
  323778, // City building
]

export const getPexelsImage = (buildingId: number) => {
  const photoId = pexelsBuildingIds[(buildingId - 1) % pexelsBuildingIds.length]
  return `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop`
}

export interface Building {
  id: number
  name: string
  location: string
  totalValue: string
  tokensAvailable: string
  progress: number
  milestonesCompleted: number
  totalMilestones: number
  featured: boolean
  category: 'Residential' | 'Commercial'
  image?: string // Opcional: caminho da imagem em public/assets/ (ex: '/assets/minha-imagem.jpg')
}

// Função que retorna a imagem do projeto
// Se o projeto tiver uma imagem definida, usa ela. Senão, usa Pexels
export const getProjectImage = (project: Building) => {
  if (project.image) {
    return project.image
  }
  return getPexelsImage(project.id)
}

export const buildings: Building[] = [
  {
    id: 1,
    name: 'Marina Tower',
    location: 'Florianópolis, Brazil',
    totalValue: '25M',
    tokensAvailable: '8.5M',
    progress: 45,
    milestonesCompleted: 3,
    totalMilestones: 8,
    featured: true,
    category: 'Residential',
    image: '/assets/predio-residencial-3-andares.jpg', // Descomente e adicione sua imagem
  },
  {
    id: 2,
    name: 'Coastal Residential Complex',
    location: 'Florianópolis, Brazil',
    totalValue: '18M',
    tokensAvailable: '12M',
    progress: 28,
    milestonesCompleted: 2,
    totalMilestones: 7,
    featured: false,
    category: 'Residential',
    image: '/assets/predio-fachada.jpg', // Descomente e adicione sua imagem

  },
  {
    id: 3,
    name: 'Business Plaza',
    location: 'Buenos Aires, Argentina',
    totalValue: '52M',
    tokensAvailable: '15M',
    progress: 62,
    milestonesCompleted: 5,
    totalMilestones: 8,
    featured: true,
    category: 'Commercial',
    image: '/assets/maquete eletrônica_prédio_low.jpg',
  },
  {
    id: 4,
    name: 'Modern Tower',
    location: 'Tokyo, Japan',
    totalValue: '85M',
    tokensAvailable: '22M',
    progress: 15,
    milestonesCompleted: 1,
    totalMilestones: 10,
    featured: false,
    category: 'Residential',
    image: '/assets/Maquete-Eletrônica-e-projeto-Miriarq3d-Edificio-fachada.jpg'
  },
  {
    id: 5,
    name: 'Beachfront Development',
    location: 'Balneário Camboriú, Brazil',
    totalValue: '31M',
    tokensAvailable: '18M',
    progress: 78,
    milestonesCompleted: 6,
    totalMilestones: 8,
    featured: false,
    category: 'Residential',
    image: '/assets/yantram-studio-modern-3d-exterior-hotel-view-ideas-beach-side-architectural-services.jpg'
  },
  {
    id: 6,
    name: 'Historic District Renovation',
    location: 'Barcelona, Spain',
    totalValue: '120M',
    tokensAvailable: '45M',
    progress: 35,
    milestonesCompleted: 3,
    totalMilestones: 9,
    featured: true,
    category: 'Commercial',
    image: '/assets/ideia.jpg',
  },
]