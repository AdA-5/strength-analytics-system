"""
Unit conversion utilities
Handles conversion between kilograms and pounds
"""

# Conversion constants
LBS_TO_KG = 0.453592
KG_TO_LBS = 2.20462


def pounds_to_kilograms(pounds):
    """
    Convert pounds to kilograms
    
    Args:
        pounds: Weight in pounds
    
    Returns:
        Weight in kilograms
    """
    kg = pounds * LBS_TO_KG
    return round(kg, 2)


def kilograms_to_pounds(kilograms):
    """
    Convert kilograms to pounds
    
    Args:
        kilograms: Weight in kilograms
    
    Returns:
        Weight in pounds
    """
    lbs = kilograms * KG_TO_LBS
    return round(lbs, 2)


def display_weight_in_both_units(weight_kg):
    """
    Display weight in both kg and lbs
    
    Args:
        weight_kg: Weight in kilograms
    
    Returns:
        Formatted string showing both units
    """
    lbs = kilograms_to_pounds(weight_kg)
    return f"{weight_kg:.2f} kg ({lbs:.2f} lbs)"


def convert_weight_to_standard(weight, unit):
    """
    Convert any weight to standard unit (kg) for storage
    
    Args:
        weight: Weight value
        unit: Unit ("kg" or "lbs")
    
    Returns:
        Tuple of (weight_in_kg, original_weight, original_unit)
    """
    if unit == "lbs":
        weight_kg = pounds_to_kilograms(weight)
        return (weight_kg, weight, "lbs")
    else:
        return (weight, weight, "kg")