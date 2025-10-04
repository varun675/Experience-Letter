import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-experience-letter',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './experience-letter.component.html',
  styleUrls: ['./experience-letter.component.css']
})
export class ExperienceLetterComponent {
  showForm = true;
  letterForm: FormGroup;
  
  letterData = {
    companyName: 'CODESMOTECH',
    date: '31st August 2025',
    dateInput: this.getTodayDate(),
    employeeName: 'Mr Manvendra Singh',
    employeeCode: '1157',
    startDate: '23rd April 2025',
    startDateInput: '',
    endDate: '3rd August 2025',
    endDateInput: '',
    designation: 'Quality Assurance',
    hrName: 'Shreya G',
    companyFullName: 'Codesmotech Consulting pvt ltd',
    title: 'Mr'
  };

  constructor(private fb: FormBuilder) {
    this.letterForm = this.fb.group({
      dateInput: [this.getTodayDate(), Validators.required],
      employeeCode: ['', Validators.required],
      title: ['Mr', Validators.required],
      employeeName: ['', Validators.required],
      startDateInput: ['', Validators.required],
      endDateInput: ['', Validators.required],
      designation: ['', Validators.required]
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  generateLetter() {
    if (this.letterForm.invalid) {
      this.letterForm.markAllAsTouched();
      return;
    }

    // Convert date inputs to formatted strings before generating letter
    this.letterData.date = this.formatDate(this.letterForm.value.dateInput);
    this.letterData.startDate = this.formatDate(this.letterForm.value.startDateInput);
    this.letterData.endDate = this.formatDate(this.letterForm.value.endDateInput);
    this.letterData.employeeCode = this.letterForm.value.employeeCode;
    this.letterData.title = this.letterForm.value.title;
    this.letterData.employeeName = this.letterForm.value.employeeName;
    this.letterData.designation = this.letterForm.value.designation;
    
    this.showForm = false;
  }

  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    // Add ordinal suffix to day
    const getOrdinalSuffix = (day: number): string => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    
    return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
  }

  getFirstName(): string {
    // Extract first name from full name (remove Mr/Ms/Mrs and get first name)
    const nameParts = this.letterData.employeeName.replace(/^(Mr\.?|Ms\.?|Mrs\.?)\s*/i, '').split(' ');
    return nameParts[0] || 'Employee';
  }

  getSubjectPronoun(): string {
    return this.letterData.title === 'Mr' ? 'he' : 'she';
  }

  getPossessivePronoun(): string {
    return this.letterData.title === 'Mr' ? 'his' : 'her';
  }

  getObjectPronoun(): string {
    return this.letterData.title === 'Mr' ? 'him' : 'her';
  }

  async generatePDF() {
    const letterElement = document.getElementById('letter-content');
    if (!letterElement) return;

    try {
      // Hide action buttons temporarily
      const actionButtons = document.querySelector('.print-section');
      if (actionButtons) {
        (actionButtons as HTMLElement).style.display = 'none';
      }

      // Configure html2canvas options for better quality
      const canvas = await html2canvas(letterElement, {
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: letterElement.offsetWidth,
        height: letterElement.offsetHeight
      });

      // Show action buttons again
      if (actionButtons) {
        (actionButtons as HTMLElement).style.display = 'block';
      }

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Calculate dimensions to fit A4
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Center the image
      const x = 10; // 10mm left margin
      const y = 10; // 10mm top margin
      
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      
      // Download the PDF
      const fileName = `Experience_Letter_${this.getFirstName()}_${new Date().getTime()}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  }
}
