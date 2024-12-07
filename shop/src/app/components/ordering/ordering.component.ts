import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ordering',
  standalone: true,
  imports: [],
  templateUrl: './ordering.component.html',
  styleUrl: './ordering.component.css'
})
export class OrderingComponent {

  constructor(private router: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['/resumen-orden']);
    }, 3000);
  }
  
}
