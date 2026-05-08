import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { User } from '../../model/entities/user.entity';
import { UserService } from '../../services/user.service';
import {
  UserModelComponent,
  UserModalData,
} from '../../components/user/user-model.component';
import { NotificationService } from '../../../shared/services/notification.service';
import { Role } from '../../model/entities/role.model';

@Component({
  selector: 'app-user-overview',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    TranslateModule,
  ],
  templateUrl: './user-overview.component.html',
  styleUrls: ['./user-overview.component.css'],
})
export class UserOverviewComponent implements OnInit, AfterViewInit {
  protected columnsToDisplay: string[] = ['firstName', 'lastName', 'email', 'role', 'actions'];
  protected dataSource = new MatTableDataSource<User>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private userService = inject(UserService);
  private dialog = inject(MatDialog);
  private notification = inject(NotificationService);
  private translate = inject(TranslateService);

  ngOnInit(): void {
    this.getAllUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onNewUser(): void {
    const dialogRef = this.dialog.open(UserModelComponent, {
      width: '500px',
      data: { mode: 'add', role: Role.USER } satisfies UserModalData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.create(result).subscribe({
          next: () => {
            this.notification.showSuccess(this.translate.instant('users.notifications.created'));
            this.getAllUsers();
          },
          error: (err) => {
            this.notification.showError(this.translate.instant('users.notifications.create-error'));
            console.error('Error creating user:', err);
          },
        });
      }
    });
  }

  protected onEditItem(user: User): void {
    const dialogRef = this.dialog.open(UserModelComponent, {
      width: '500px',
      data: { mode: 'edit', role: user.role, user: { ...user } } satisfies UserModalData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.update(result.id, result).subscribe({
          next: () => {
            this.notification.showSuccess(this.translate.instant('users.notifications.updated'));
            this.getAllUsers();
          },
          error: (err) => {
            this.notification.showError(this.translate.instant('users.notifications.update-error'));
            console.error('Error updating user:', err);
          },
        });
      }
    });
  }

  protected onDeleteItem(user: User): void {
    const dialogRef = this.dialog.open(UserModelComponent, {
      width: '500px',
      data: { mode: 'delete', role: user.role, user } satisfies UserModalData,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.userService.delete(user.id).subscribe({
          next: () => {
            this.notification.showSuccess(this.translate.instant('users.notifications.deleted'));
            this.dataSource.data = this.dataSource.data.filter((u) => u.id !== user.id);
          },
          error: (err) => {
            this.notification.showError(this.translate.instant('users.notifications.delete-error'));
            console.error('Error deleting user:', err);
          },
        });
      }
    });
  }

  private getAllUsers(): void {
    this.userService.getAll().subscribe({
      next: (users: User[]) => {
        this.dataSource.data = users;
      },
      error: (err) => {
        this.notification.showError(this.translate.instant('users.notifications.load-error'));
        console.error('Error loading users:', err);
      },
    });
  }
}
