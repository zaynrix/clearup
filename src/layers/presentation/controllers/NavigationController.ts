import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { BaseViewController } from './BaseViewController'

/**
 * Navigation Controller - Presentation Layer (Controller in MVC)
 * Handles navigation-related UI interactions
 */
export class NavigationController extends BaseViewController {
  private router = useRouter()
  private isMenuOpen: Ref<boolean> = ref(false)

  /**
   * Toggle menu state
   */
  toggleMenu(): void {
    this.isMenuOpen.value = !this.isMenuOpen.value
  }

  /**
   * Close menu
   */
  closeMenu(): void {
    this.isMenuOpen.value = false
  }

  /**
   * Open menu
   */
  openMenu(): void {
    this.isMenuOpen.value = true
  }

  /**
   * Navigate to a route
   */
  navigateTo(route: string): void {
    this.closeMenu()
    this.router.push(route)
  }

  /**
   * Get menu state
   */
  get menuIsOpen(): boolean {
    return this.isMenuOpen.value
  }
}

