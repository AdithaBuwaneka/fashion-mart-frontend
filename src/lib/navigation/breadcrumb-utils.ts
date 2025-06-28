// src/lib/navigation/breadcrumb-utils.ts
export interface BreadcrumbItem {
  label: string
  href?: string
  isCurrentPage?: boolean
}

export const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  // Add home/dashboard
  if (segments.length > 0) {
    breadcrumbs.push({
      label: 'Dashboard',
      href: `/${segments[0]}/dashboard`
    })
  }

  // Generate breadcrumbs from path segments
  let currentPath = ''
  for (let i = 0; i < segments.length; i++) {
    currentPath += `/${segments[i]}`
    
    // Skip the role segment (first segment)
    if (i === 0) continue
    
    const isLast = i === segments.length - 1
    const label = formatSegmentLabel(segments[i])
    
    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath,
      isCurrentPage: isLast
    })
  }

  return breadcrumbs
}

const formatSegmentLabel = (segment: string): string => {
  // Handle special cases
  const specialCases: Record<string, string> = {
    'dashboard': 'Dashboard',
    'users': 'Users',
    'products': 'Products',
    'orders': 'Orders',
    'designs': 'Designs',
    'inventory': 'Inventory',
    'inventory_manager': 'Inventory Manager',
    'reports': 'Reports',
    'analytics': 'Analytics',
    'settings': 'Settings',
    'profile': 'Profile',
    'cart': 'Shopping Cart',
    'checkout': 'Checkout',
    'returns': 'Returns',
    'collaborations': 'Collaborations',
    'earnings': 'Earnings',
    'customers': 'Customers',
    'support': 'Support',
    'stock': 'Stock Management',
    'alerts': 'Alerts',
    'pending': 'Pending',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'new': 'New',
    'edit': 'Edit',
    'bill-scanner': 'Bill Scanner'
  }

  if (specialCases[segment]) {
    return specialCases[segment]
  }

  // Convert kebab-case to Title Case
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}