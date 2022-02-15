import { ActiveLink } from '../ActiveLink';

import { SigInButton } from '../SignInButton'
import styles from './styles.module.scss'

export function Header() {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/images/logo.svg" alt="ig.news" />

                <nav>
                    <ActiveLink activeClassName={styles.active} href={'/'}>
                        <a className={styles.active}>Home</a>
                    </ActiveLink>
                    <ActiveLink activeClassName={styles.active} href={'/posts'} prefetch>
                        <a>Posts</a>
                    </ActiveLink>
                </nav>

                <SigInButton />
            </div>
        </header>
    )
}