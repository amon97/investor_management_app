"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Coins, Newspaper, Settings, GraduationCap } from "lucide-react";

const navItems = [
    { href: "/", label: "ホーム", icon: Home },
    { href: "/dividends", label: "配当", icon: Coins },
    { href: "/learn", label: "学習", icon: GraduationCap },
    { href: "/news", label: "ニュース", icon: Newspaper },
    { href: "/manage", label: "管理", icon: Settings },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="bottom-nav" role="navigation" aria-label="メインナビゲーション">
            {navItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                    <Link
                        key={href}
                        href={href}
                        className={isActive ? "active" : ""}
                        aria-current={isActive ? "page" : undefined}
                    >
                        <Icon strokeWidth={2.5} />
                        <span>{label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
