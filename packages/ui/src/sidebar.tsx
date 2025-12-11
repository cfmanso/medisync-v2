import * as React from 'react';

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  footer?: React.ReactNode;
}
export interface SidebarItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: React.ReactNode;
  active?: boolean;
  as?: React.ElementType;
}

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ className = '', logo, footer, children, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={`flex flex-col h-screen bg-primary-600 text-white w-64 ${className}`}
        {...props}
      >
        {logo && (
          <div className="flex items-center justify-center h-16 border-b border-primary-700 px-4">
            {logo}
          </div>
        )}
        <nav className="flex-1 overflow-y-auto py-4">
          {children}
        </nav>
        {footer && (
          <div className="border-t border-primary-700 p-4">
            {footer}
          </div>
        )}
      </aside>
    );
  }
);

Sidebar.displayName = 'Sidebar';

export interface SidebarItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: React.ReactNode;
  active?: boolean;
}

export const SidebarItem = React.forwardRef<HTMLAnchorElement, SidebarItemProps>(
  ({ className = '', icon, active = false, children, as: Component = 'a', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`
          flex items-center px-4 py-3 mx-2 rounded-md transition-colors cursor-pointer
          ${active 
            ? 'bg-primary-700 text-white' 
            : 'text-primary-100 hover:bg-primary-700 hover:text-white'
          }
          ${className}
        `}
        {...props}
      >
        {icon && <span className="mr-3">{icon}</span>}
        {children}
      </Component>
    );
  }
);

SidebarItem.displayName = 'SidebarItem';

export interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className = '', title, children, ...props }, ref) => {
    return (
      <div ref={ref} className={`mb-4 ${className}`} {...props}>
        {title && (
          <h3 className="px-4 mb-2 text-xs font-semibold text-primary-300 uppercase tracking-wider">
            {title}
          </h3>
        )}
        {children}
      </div>
    );
  }
);

SidebarGroup.displayName = 'SidebarGroup';
