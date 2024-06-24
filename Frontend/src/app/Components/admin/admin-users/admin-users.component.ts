import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../../../Services/auth.service';
import { AdminService } from '../../../Services/admin.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  paginatedUsers: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10; //Cambiar el tamaño maximo de registros que se pueden ver
  Math: any = Math;
  constructor(
    private authService: AuthService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.adminService.GetAllUsers().subscribe(
      (data) => {
        this.users = data;
        this.setPaginatedUsers();
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  setPaginatedUsers(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedUsers = this.users.slice(start, end);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.setPaginatedUsers();
  }
}
